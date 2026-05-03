Shogun Command Documentation
============================

Shogun Command is a private Next.js mission-control dashboard for a Raspberry Pi
<PI_USER>@<PI_SSH_HOST>. The public hostname is protected by application-level Google OAuth,
with command pages and command APIs locked behind an allowlisted Google account.

.. toctree::
   :maxdepth: 2
   :caption: Core Docs

   architecture
   google-authentication
   deployment
   operations
   requirements

Quick Facts
-----------

.. list-table::
   :header-rows: 1

   * - Area
     - Value
   * - App
     - Next.js App Router, React, Tailwind CSS
   * - Local dev URL
     - ``http://localhost:3000``
   * - Pi app path
     - ``/home/<PI_USER>/shogun-command``
   * - Pi app port
     - ``127.0.0.1:3000``
   * - Public URL
     - ``https://your-public-hostname.example.com``
   * - Public access path
     - Cloudflare Tunnel -> Nginx -> Shogun Command
   * - Auth
     - Auth.js / NextAuth Google provider with explicit email allowlist

Safety Rule
-----------

Do not commit real runtime secrets. Keep ``.env.local`` and
``.env.production`` out of Git. The tracked examples document the required
keys without containing credentials.
