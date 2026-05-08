Implementation
--------------

Implementation Overview
~~~~~~~~~~~~~~~~~~~~~~~

Google Authentication is implemented as a small set of cooperating Next.js and
Auth.js entrypoints. The feature does not put authentication checks inside every
page or API handler. Instead, shared Auth.js configuration provides the session
helpers, middleware applies the first route guard, and the command layout adds a
server-side page guard before rendering private UI.

Code Ownership
~~~~~~~~~~~~~~

The implementation centers on
``features/security/google-authentication/auth.ts``. That file creates the
Auth.js configuration, registers the Google provider, enables JWT sessions, and
exports the helpers used by the rest of the application. The root ``auth.ts``
file remains as a thin compatibility export for framework entrypoints and
existing imports.

.. include:: diagrams/auth-code-map.mmd.inc

The Auth.js exports are reused in a few focused places:

* ``middleware.ts`` uses ``auth`` to inspect the current request session before
  protected routes continue.
* ``app/api/auth/[...nextauth]/route.ts`` exposes the Auth.js ``GET`` and
  ``POST`` handlers needed by the Google OAuth callback flow.
* ``features/security/google-authentication/actions.ts`` uses ``signIn`` and
  ``signOut`` for server actions triggered by the login page and command shell.
* ``app/(command)/layout.tsx`` calls ``auth()`` before rendering private command
  pages.

This keeps the authentication rules in one shared configuration while allowing
each UI or routing layer to use the helper that fits its job.

Main Implementation Flow
~~~~~~~~~~~~~~~~~~~~~~~~

``features/security/google-authentication/auth.ts`` reads
``AUTH_ALLOWED_EMAILS`` when the application starts and turns the
comma-separated value into a normalized set. Each configured email is trimmed,
lowercased, and ignored if it is empty. That gives the sign-in callback a simple
membership check instead of repeating parsing logic during every login.

The Auth.js configuration registers the Google provider and uses JWT-backed
sessions. During sign-in, Auth.js receives the Google profile and the current
user object. Shogun Command takes the best available email from those values,
normalizes it to lowercase, and only accepts the login when that email exists in
the allowlist.

If the email is missing or not allowlisted, the callback rejects the sign-in.
Auth.js then sends the browser back to the configured error page, which is the
same public ``/login`` page used to start authentication.

The middleware is the first application-level gate for incoming requests. It
allows public auth paths through, lets authenticated requests continue, and then
splits unauthenticated requests by request type.

.. include:: diagrams/middleware-decision.mmd.inc

``/login`` and ``/api/auth/*`` stay public because they are needed to start and
finish the OAuth flow. For every other path, middleware checks whether Auth.js
found a session on the request.

When an unauthenticated browser requests a protected page, middleware redirects
to ``/login`` and stores the originally requested path in ``callbackUrl``. That
lets the application return the operator to the page they originally wanted
after a successful login.

When an unauthenticated request targets an API route, middleware returns
``401`` JSON instead of redirecting. The API handlers can therefore stay focused
on their domain work; they rely on middleware to reject anonymous callers before
the handler runs.

Command pages live under ``app/(command)`` and share a protected layout. That
layout calls ``auth()`` on the server before rendering the sidebar, mobile
header, or page content.

Middleware should already have redirected anonymous page requests, but the
layout check keeps the page tree defensive. If a page render reaches the layout
without a session, it redirects to ``/login`` instead of rendering private UI.
If a session exists, the layout passes the user into the command shell so the
sidebar and mobile header can show the signed-in identity and sign-out control.

``app/login/page.tsx`` is public and intentionally standalone. It does not use
the command shell layout, so unauthenticated users only see the focused login
screen.

The page reads two query parameters:

* ``callbackUrl`` tells the app where to send an approved operator after login.
* ``error`` lets the page show a friendly access denied message when Auth.js
  rejects a non-allowlisted Google account.

Before using ``callbackUrl``, the page sanitizes it. Only same-site relative
paths are accepted; missing values, absolute URLs, and protocol-relative values
fall back to ``/``. If an already-authenticated operator opens ``/login``, the
page redirects them to that safe callback path immediately.

``features/security/google-authentication/actions.ts`` contains the server
actions used by the login page and command shell. ``signInWithGoogle`` receives
the submitted
``callbackUrl``, applies the same safe relative URL rule, and starts the Auth.js
Google provider flow with that redirect target.

``signOutOfGoogle`` ends the Auth.js session and redirects the browser to
``/login``. The sidebar and mobile header both use this action, so desktop and
mobile sign-out behavior stays consistent.

Important Details
~~~~~~~~~~~~~~~~~

Google Authentication depends on these environment variables:

.. list-table::
   :header-rows: 1

   * - Variable
     - Local PC value
     - Pi production value
   * - ``AUTH_SECRET``
     - random secret
     - random secret
   * - ``AUTH_URL``
     - ``http://localhost:3000``
     - ``https://your-public-hostname.example.com``
   * - ``AUTH_GOOGLE_ID``
     - Google OAuth client ID
     - Google OAuth client ID
   * - ``AUTH_GOOGLE_SECRET``
     - Google OAuth client secret
     - Google OAuth client secret
   * - ``AUTH_ALLOWED_EMAILS``
     - comma-separated allowed emails
     - comma-separated allowed emails

Generate ``AUTH_SECRET`` with:

.. code-block:: bash

   openssl rand -base64 32

Create a Google OAuth **Web application** client in Google Cloud Console.

Authorized JavaScript origins:

.. code-block:: text

   http://localhost:3000
   https://your-public-hostname.example.com

Authorized redirect URIs:

.. code-block:: text

   http://localhost:3000/api/auth/callback/google
   https://your-public-hostname.example.com/api/auth/callback/google

The redirect URI must match exactly. ``redirect_uri_mismatch`` means the app
URL, scheme, host, port, or callback path differs from what Google has
configured.

For local validation, copy ``.env.example`` to ``.env.local``, install
dependencies, and run the development server:

.. code-block:: bash

   cp .env.example .env.local
   npm install
   npm run dev

Open ``http://localhost:3000`` and confirm that ``/`` redirects to ``/login``,
``/login`` shows the Google login screen, an allowlisted Google account enters
the dashboard, and ``/api/system/health`` returns ``401`` before sign-in.

For Pi validation, open ``https://your-public-hostname.example.com`` and confirm
that ``/`` redirects to ``/login``, ``/login`` returns ``200``, Google login
loads the dashboard for an allowlisted account, and a non-allowlisted account
receives the access denied login error.

Maintenance Notes
~~~~~~~~~~~~~~~~~

Keep the allowlist parsing centralized in
``features/security/google-authentication/auth.ts`` so every login uses the same
normalization rule. Keep ``/login`` and ``/api/auth/*`` public in
``middleware.ts``; the OAuth flow cannot start or finish if those routes require
an existing session.

When adding new command pages or command APIs, keep them behind the existing
middleware matcher and command layout instead of adding one-off authentication
checks in individual handlers.
