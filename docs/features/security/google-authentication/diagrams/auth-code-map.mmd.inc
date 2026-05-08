.. mermaid::

   flowchart LR
     Env["AUTH_* environment variables"]
     AuthFeature["features/security/google-authentication/auth.ts"]
     AuthTs["auth.ts compatibility export"]
     Middleware["middleware.ts"]
     AuthRoute["app/api/auth/[...nextauth]/route.ts"]
     Actions["features/security/google-authentication/actions.ts"]
     Login["app/login/page.tsx"]
     Layout["app/(command)/layout.tsx"]
     Shell["components/command/shell.tsx"]
     APIs["app/api/* command APIs"]

     Env --> AuthFeature
     AuthFeature --> AuthTs
     AuthTs --> Middleware
     AuthTs --> AuthRoute
     AuthFeature --> Actions
     AuthTs --> Layout
     Login --> Actions
     Shell --> Actions
     Middleware --> APIs
