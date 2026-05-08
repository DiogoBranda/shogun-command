.. mermaid::

   flowchart LR
     Browser["Browser / client"]
     Middleware["middleware.ts route guard"]
     Login["app/login/page.tsx"]
     Actions["features/security/google-authentication/actions.ts"]
     AuthConfig["features/security/google-authentication/auth.ts"]
     AuthCompat["auth.ts compatibility export"]
     AuthRoute["app/api/auth/[...nextauth]/route.ts"]
     Google["Google OAuth"]
     Pages["Protected command pages"]
     APIs["Protected command APIs"]
     Env["Auth environment variables"]

     Browser --> Middleware
     Middleware --> Login
     Middleware --> Pages
     Middleware --> APIs
     Login --> Actions
     Actions --> AuthConfig
     AuthRoute --> AuthCompat
     AuthCompat --> AuthConfig
     AuthConfig --> Google
     AuthConfig --> Env
