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

.. arch:: Runtime topology
   :id: ARCH_RUNTIME_TOPOLOGY
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

Live Refresh Model
------------------

The Mission Control dashboard is synced with the Raspberry Pi only when the
Next.js process is running on the Pi. The browser polls same-origin API routes;
those API routes read the machine that hosts the Next.js server.

.. impl:: Dashboard live polling
   :id: IMPL_DASHBOARD_LIVE_POLLING
   :status: active
   :owner: Codex

   ``app/(command)/page.tsx`` performs the first authenticated server render.
   ``app/(command)/system-dashboard.tsx`` then refreshes the live machine data
   every five seconds by calling ``/api/system/health`` and
   ``/api/system/services`` with ``cache: "no-store"``. The timestamp shown in
   the dashboard comes from the latest health API response.

This means local development at ``http://localhost:3000`` shows local machine
state, while the public Pi deployment shows Pi state.

Data Sources
------------

The dashboard reads live machine and workspace state rather than mock data:

* ``lib/system.ts`` reads host, uptime, CPU, memory, disk, temperature, and service state.
* ``lib/workspace.ts`` discovers configured filesystem roots and candidate documents.
* ``lib/team.ts`` reads the local team configuration or default roster.
* ``lib/config.ts`` creates and reads local generated config under ``config/``.

Generated local config is ignored by Git because it can vary by machine.
