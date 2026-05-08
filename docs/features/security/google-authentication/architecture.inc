Architecture
------------

Static Structure
~~~~~~~~~~~~~~~~

.. arch:: Google auth boundary
   :id: ARCH_GAUTH_AUTH_BOUNDARY
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_PROTECTED_PAGES, REQ_GAUTH_GOOGLE_OAUTH, REQ_GAUTH_EMAIL_ALLOWLIST, REQ_GAUTH_PUBLIC_AUTH_ROUTES

   The static structure diagram shows the authentication boundary around
   Shogun Command. Browser requests first pass through middleware, which
   separates public auth routes from protected command pages and APIs.

   .. include:: diagrams/static-structure.mmd.inc

   Google Authentication is split between middleware route protection, a public
   login page, Auth.js configuration, the Auth.js callback route, and Google
   OAuth. Environment variables provide the OAuth credentials, app URL, session
   secret, and approved email list.

Sequence
~~~~~~~~

.. arch:: Google auth login sequence
   :id: ARCH_GAUTH_LOGIN_SEQUENCE
   :status: active
   :owner: Diogo
   :links: REQ_GAUTH_CALLBACK_PRESERVED, REQ_GAUTH_DENIED_LOGIN, REQ_GAUTH_API_REJECTS_ANONYMOUS, REQ_GAUTH_SIGN_OUT_LOGIN

   The sequence diagram follows the main operator login path. A protected page
   request is redirected to login with the requested destination preserved.

   .. include:: diagrams/login-sequence.mmd.inc

   Google OAuth handles identity, then Auth.js returns to Shogun Command so the
   configured allowlist can decide whether the browser receives a session or an
   access denied login result. API requests without a session are rejected with
   ``401`` JSON by middleware.
