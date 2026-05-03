Architecture
============

System Overview
---------------

.. mermaid::

   flowchart LR
     Browser["Browser"] --> Cloudflare["Cloudflare Tunnel"]
     Cloudflare --> Nginx["Nginx on Raspberry Pi :80"]
     Nginx --> Next["Shogun Command Next.js :3000"]
     Next --> Auth["Auth.js Google OAuth"]
     Next --> APIs["Command APIs"]
     Next --> LocalState["Pi OS, services, filesystem"]
     Auth --> Google["Google OAuth"]

.. spec:: Runtime topology
   :id: SPEC_RUNTIME_TOPOLOGY
   :status: active
   :owner: Diogo

   Public traffic for ``your-public-hostname.example.com`` enters through Cloudflare Tunnel,
   reaches Nginx on the Pi, and is proxied to the Next.js process listening on
   ``127.0.0.1:3000``.

Application Boundaries
----------------------

.. mermaid::

   flowchart TB
     RootLayout["app/layout.tsx"] --> PublicLogin["app/login/page.tsx"]
     RootLayout --> CommandLayout["app/(command)/layout.tsx"]
     CommandLayout --> Mission["app/(command)/page.tsx"]
     CommandLayout --> Team["app/(command)/team/page.tsx"]
     Middleware["middleware.ts"] --> PublicLogin
     Middleware --> CommandLayout
     Middleware --> ApiRoutes["app/api/*"]
     AuthConfig["auth.ts"] --> Middleware
     AuthConfig --> AuthRoute["app/api/auth/[...nextauth]/route.ts"]

.. impl:: Protected route group
   :id: IMPL_PROTECTED_ROUTE_GROUP
   :status: active
   :owner: Codex

   The visible command center pages live under ``app/(command)`` so their URLs
   remain ``/`` and ``/team`` while sharing an authenticated shell layout.

.. impl:: Neutral root layout
   :id: IMPL_NEUTRAL_ROOT_LAYOUT
   :status: active
   :owner: Codex

   ``app/layout.tsx`` owns only HTML, body, fonts, and global styles. It does
   not render the command sidebar so ``/login`` can remain standalone.

Data Sources
------------

The dashboard reads live machine and workspace state rather than mock data:

* ``lib/system.ts`` reads host, uptime, CPU, memory, disk, temperature, and service state.
* ``lib/workspace.ts`` discovers configured filesystem roots and candidate documents.
* ``lib/team.ts`` reads the local team configuration or default roster.
* ``lib/config.ts`` creates and reads local generated config under ``config/``.

Generated local config is ignored by Git because it can vary by machine.
