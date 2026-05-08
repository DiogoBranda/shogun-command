.. mermaid::

   sequenceDiagram
     actor Operator
     participant Browser
     participant Middleware
     participant Login as Login page
     participant Auth as Auth.js
     participant Google as Google OAuth

     Operator->>Browser: Open protected page
     Browser->>Middleware: GET protected page
     Middleware-->>Browser: Redirect to /login?callbackUrl=...
     Operator->>Login: Continue With Google
     Login->>Auth: Start Google sign-in
     Auth->>Google: OAuth authorization request
     Google-->>Auth: Callback with Google profile
     Auth->>Auth: Check AUTH_ALLOWED_EMAILS
     alt email allowed
       Auth-->>Browser: Session + redirect to callbackUrl
     else email denied
       Auth-->>Browser: Redirect to /login?error=AccessDenied
     end
