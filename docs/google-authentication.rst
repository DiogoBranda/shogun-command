Google Authentication
=====================

Goal
----

.. req:: Google login protects Shogun Command
   :id: REQ_GOOGLE_AUTH
   :status: active
   :owner: Diogo

   Public and local users must authenticate with Google before accessing command
   pages or command APIs.

.. req:: Only allow approved Google accounts
   :id: REQ_EMAIL_ALLOWLIST
   :status: active
   :owner: Diogo

   Authentication alone is not enough. The app must reject users whose email is
   not listed in ``AUTH_ALLOWED_EMAILS``.

Auth Flow
---------

.. mermaid::

   sequenceDiagram
     participant U as User
     participant S as Shogun Command
     participant G as Google OAuth
     U->>S: GET /
     S-->>U: 307 /login?callbackUrl=/
     U->>S: POST Continue With Google
     S-->>G: OAuth authorization request
     G-->>U: Google login / consent
     G-->>S: /api/auth/callback/google
     S->>S: Check AUTH_ALLOWED_EMAILS
     alt email allowed
       S-->>U: Session cookie + redirect to /
     else email denied
       S-->>U: Redirect to /login?error=AccessDenied
     end

Implementation
--------------

.. impl:: Auth.js configuration
   :id: IMPL_AUTHJS_CONFIG
   :status: active
   :owner: Codex
   :links: REQ_GOOGLE_AUTH, REQ_EMAIL_ALLOWLIST

   ``auth.ts`` configures Auth.js / NextAuth with the Google provider, JWT
   sessions, custom sign-in page, and email allowlist callback.

.. impl:: Auth route handler
   :id: IMPL_AUTH_ROUTE
   :status: active
   :owner: Codex
   :links: IMPL_AUTHJS_CONFIG

   ``app/api/auth/[...nextauth]/route.ts`` exports the Auth.js ``GET`` and
   ``POST`` handlers used by Google OAuth callbacks.

.. impl:: Middleware protection
   :id: IMPL_AUTH_MIDDLEWARE
   :status: active
   :owner: Codex
   :links: REQ_GOOGLE_AUTH

   ``middleware.ts`` allows ``/login`` and ``/api/auth/*`` publicly, redirects
   unauthenticated page requests to ``/login``, and returns ``401`` JSON for
   unauthenticated command API requests.

Required Environment Variables
------------------------------

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

Google Cloud Console Setup
--------------------------

Create a Google OAuth **Web application** client in Google Cloud Console.

Authorized JavaScript origins:

.. code-block:: text

   http://localhost:3000
   https://your-public-hostname.example.com

Authorized redirect URIs:

.. code-block:: text

   http://localhost:3000/api/auth/callback/google
   https://your-public-hostname.example.com/api/auth/callback/google

The URI must match exactly. ``redirect_uri_mismatch`` means the app URL,
scheme, host, port, or callback path differs from what Google has configured.

Local Test
----------

.. code-block:: bash

   cp .env.example .env.local
   npm install
   npm run dev

Open ``http://localhost:3000``. Expected behavior:

* ``/`` redirects to ``/login``.
* ``/login`` shows the Shogun Google login screen.
* an allowlisted Google account enters the dashboard.
* ``/api/system/health`` returns ``401`` before sign-in.

Pi Test
-------

Open ``https://your-public-hostname.example.com``. Expected behavior:

* ``/`` redirects to ``/login``.
* ``/login`` returns ``200``.
* after Google login, the dashboard loads.
* a non-allowlisted account receives an access denied login error.
