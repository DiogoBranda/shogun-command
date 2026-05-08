Validation
----------

.. test:: Public root redirects to login
   :id: TEST_GAUTH_PUBLIC_ROOT_REDIRECT
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_PROTECTED_PAGES, REQ_GAUTH_CALLBACK_PRESERVED

   An unauthenticated request to the public root URL should return ``307`` with
   a location ending in ``/login?callbackUrl=%2F``.

.. test:: Public login loads
   :id: TEST_GAUTH_PUBLIC_LOGIN_200
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_GOOGLE_OAUTH, REQ_GAUTH_PUBLIC_AUTH_ROUTES

   ``/login`` should return ``200`` without an existing authenticated session.

.. test:: Public API rejects anonymous users
   :id: TEST_GAUTH_PUBLIC_API_401
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_API_REJECTS_ANONYMOUS

   An unauthenticated request to ``/api/system/health`` should return ``401``
   and JSON ``{"error":"Authentication required"}``.

.. test:: Allowlisted account reaches dashboard
   :id: TEST_GAUTH_ALLOWED_ACCOUNT_LOGIN
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_GOOGLE_OAUTH, REQ_GAUTH_EMAIL_ALLOWLIST

   A Google account listed in ``AUTH_ALLOWED_EMAILS`` should complete the
   Google OAuth flow and reach the requested Shogun Command page.

.. test:: Denied account returns to login
   :id: TEST_GAUTH_DENIED_ACCOUNT_LOGIN
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_EMAIL_ALLOWLIST, REQ_GAUTH_DENIED_LOGIN

   A Google account that is not listed in ``AUTH_ALLOWED_EMAILS`` should return
   to ``/login?error=AccessDenied`` instead of receiving a command session.

.. test:: Sign out returns to login
   :id: TEST_GAUTH_SIGN_OUT_LOGIN
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_SIGN_OUT_LOGIN

   Signing out from the command shell should end the session and redirect the
   browser to ``/login``.
