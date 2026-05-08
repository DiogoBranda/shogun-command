Overview
--------

Introduction
~~~~~~~~~~~~

Shogun Command is exposed through a public route but is intended for private
operation. Google Authentication provides the first security boundary: a visitor
must sign in with Google, and the signed-in email must match the configured
allowlist before the dashboard or command APIs become available.

This feature keeps the login flow simple for the approved operator while
rejecting unknown Google accounts and unauthenticated API requests.

User Scenario
~~~~~~~~~~~~~

.. scenario:: Approved operator enters Shogun Command
   :id: SCN_GOOGLE_AUTH_APPROVED_OPERATOR
   :status: active
   :owner: Diogo

   An approved operator opens Shogun Command from a browser, signs in with their
   Google account, and reaches the dashboard only after the app confirms that
   the account email is allowed.

Use Case
~~~~~~~~

.. usecase:: Operator signs in with Google
   :id: UC_GOOGLE_AUTH_OPERATOR_LOGIN
   :status: active
   :owner: Diogo
   :links: SCN_GOOGLE_AUTH_APPROVED_OPERATOR

   **Actors**

   * Client
   * Shogun Command
   * Google OAuth
   * Approved operator

   **Preconditions**

   * Shogun Command is reachable from the browser.
   * Google OAuth credentials are configured.
   * ``AUTH_ALLOWED_EMAILS`` contains the approved operator email.
   * The operator is not already authenticated.

   **Expectations**

   * Protected pages are not visible before authentication.
   * Approved Google accounts can enter Shogun Command.
   * Unknown Google accounts are rejected.
   * Unauthenticated command API calls return ``401``.

   **Main Flow**

   #. The operator opens a protected Shogun Command page.
   #. Shogun Command redirects the browser to ``/login`` with the requested page
      preserved as ``callbackUrl``.
   #. The operator selects ``Continue With Google``.
   #. Google OAuth authenticates the operator.
   #. Shogun Command checks the returned email against ``AUTH_ALLOWED_EMAILS``.
   #. The approved operator receives a session and is redirected to the requested
      page.

   **Alternate Flows**

   * If the Google account is not allowlisted, Shogun Command returns the
     operator to ``/login`` with an access denied message.
   * If a command API is called without an authenticated session, Shogun Command
     returns ``401`` JSON instead of redirecting.

Functional Requirements
~~~~~~~~~~~~~~~~~~~~~~~

.. req:: Protected pages require authentication
   :id: REQ_GAUTH_PROTECTED_PAGES
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   Shogun Command must prevent unauthenticated users from viewing command pages.

.. req:: Login uses Google OAuth
   :id: REQ_GAUTH_GOOGLE_OAUTH
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   The login page must let the operator start authentication through Google
   OAuth.

.. req:: Approved email is required
   :id: REQ_GAUTH_EMAIL_ALLOWLIST
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   A Google account must only receive access when its email is listed in
   ``AUTH_ALLOWED_EMAILS``.

.. req:: Denied accounts return to login
   :id: REQ_GAUTH_DENIED_LOGIN
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   A Google account that is not allowlisted must return to ``/login`` with an
   access denied message.

.. req:: Protected APIs reject anonymous calls
   :id: REQ_GAUTH_API_REJECTS_ANONYMOUS
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   Command API routes must return ``401`` JSON when called without an
   authenticated session.

.. req:: Requested page is preserved during login
   :id: REQ_GAUTH_CALLBACK_PRESERVED
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   When an unauthenticated operator opens a protected page, Shogun Command must
   preserve the requested path as a safe ``callbackUrl`` and return the approved
   operator there after login.

.. req:: Auth routes remain public
   :id: REQ_GAUTH_PUBLIC_AUTH_ROUTES
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   The login page and Auth.js callback routes must remain reachable without an
   existing session so the Google OAuth flow can start and complete.

.. req:: Sign out returns to login
   :id: REQ_GAUTH_SIGN_OUT_LOGIN
   :status: active
   :owner: Diogo
   :links: UC_GOOGLE_AUTH_OPERATOR_LOGIN

   When the operator signs out, Shogun Command must end the session and return
   the browser to ``/login``.
