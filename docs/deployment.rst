Deployment
==========

Current Pi State
----------------

.. spec:: Production hostname
   :id: SPEC_PUBLIC_HOSTNAME
   :status: active
   :owner: Diogo

   ``https://your-public-hostname.example.com`` is the public Shogun Command hostname.

.. spec:: Production process
   :id: SPEC_PI_PROCESS
   :status: active
   :owner: Diogo

   The app runs as systemd service ``shogun-command`` from
   ``/home/<PI_USER>/shogun-command`` and listens on ``127.0.0.1:3000``.

.. spec:: Production proxy
   :id: SPEC_NGINX_PROXY
   :status: active
   :owner: Diogo

   Nginx receives ``your-public-hostname.example.com`` on port ``80`` from Cloudflare Tunnel and
   proxies requests to ``http://127.0.0.1:3000``.

Deployment Path
---------------

.. mermaid::

   flowchart TD
     Local["Local repo"]
     Rsync["scripts/deploy-local-to-pi.sh"]
     Pull["scripts/deploy-on-pi.sh"]
     PiPath["Pi /home/<PI_USER>/shogun-command"]
     EnvFile[".env.production"]
     Systemd["systemd shogun-command"]
     Nginx["Nginx shogun-command site"]
     Public["https://your-public-hostname.example.com"]

     Local --> Rsync --> PiPath
     Local --> GitHub["GitHub origin/main"] --> Pull --> PiPath
     EnvFile --> Systemd
     PiPath --> Systemd
     Systemd --> Nginx --> Public

Pi Service
----------

Base service:

.. code-block:: ini

   [Unit]
   Description=Shogun Command Next.js dashboard
   After=network-online.target
   Wants=network-online.target

   [Service]
   Type=simple
   User=<PI_USER>
   Group=<PI_USER>
   WorkingDirectory=/home/<PI_USER>/shogun-command
   Environment=NODE_ENV=production
   Environment=PORT=3000
   ExecStart=/usr/bin/npm run start
   Restart=on-failure
   RestartSec=5

   [Install]
   WantedBy=multi-user.target

Auth environment drop-in:

.. code-block:: ini

   [Service]
   EnvironmentFile=/home/<PI_USER>/shogun-command/.env.production

The drop-in path is:

.. code-block:: text

   /etc/systemd/system/shogun-command.service.d/auth.conf

Production Environment Template
-------------------------------

Use ``.env.production.example`` as the local, tracked template. The real file on
the Pi is:

.. code-block:: text

   /home/<PI_USER>/shogun-command/.env.production

It must contain:

.. code-block:: text

   AUTH_SECRET=
   AUTH_URL=https://your-public-hostname.example.com
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   AUTH_ALLOWED_EMAILS=

Deploy From Local Repo
----------------------

Documentation is not deployed to the Raspberry Pi. It stays in the local Git
repository and GitHub by default.

.. code-block:: bash

   PI_SSH=<PI_USER>@<PI_SSH_HOST> PI_APP_DIR=/home/<PI_USER>/shogun-command npm run deploy:local

Required variables:

.. code-block:: text

   PI_SSH=<PI_USER>@<PI_SSH_HOST>
   PI_APP_DIR=/home/<PI_USER>/shogun-command

The script intentionally has no public default for these values, so a public
repo does not expose the private Pi username or hostname. Set them in your shell
or a private local wrapper.

Example:

.. code-block:: bash

   PI_SSH=<PI_USER>@<PI_SSH_HOST> PI_APP_DIR=/home/<PI_USER>/shogun-command npm run deploy:local

The local deploy script runs ``npx tsc --noEmit`` and ``npm run lint``, then
syncs source to ``<PI_USER>@<PI_SSH_HOST>:/home/<PI_USER>/shogun-command/`` with these
paths excluded:

* ``docs/`` unless ``DEPLOY_DOCS=1`` is set.
* ``node_modules/``
* ``.next/``
* ``.git/``
* ``.env.local``
* ``.env.production``
* ``*.local.md``
* ``config/*.local.json``
* ``tsconfig.tsbuildinfo``

Deploy From The Pi
------------------

Use this when the Pi already has the Git checkout and should pull from
``origin/main`` itself.

.. code-block:: bash

   ssh <PI_USER>@<PI_SSH_HOST>
   cd /home/<PI_USER>/shogun-command
   npm run deploy:pi

The Pi deploy script runs ``git fetch``, ``git pull --ff-only origin main``,
``npm ci``, ``npm run build``, restarts ``shogun-command``, and prints service
status plus recent logs. It defaults ``PI_APP_DIR`` to the current directory
when run on the Pi. Use ``PI_APP_DIR``, ``GIT_REMOTE``, or ``GIT_BRANCH`` to
override runtime values.

Enable Public Nginx Route
-------------------------

.. code-block:: bash

   sudo ln -sf /etc/nginx/sites-available/shogun-command /etc/nginx/sites-enabled/shogun-command
   sudo nginx -t
   sudo systemctl reload nginx

The active Nginx proxy file should contain:

.. code-block:: nginx

   server {
       listen 80;
       listen [::]:80;
       server_name your-public-hostname.example.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }

Verification
------------

After any deployment, confirm the process and logs:

.. code-block:: bash

   ssh <PI_USER>@<PI_SSH_HOST>
   systemctl status shogun-command --no-pager -l
   journalctl -u shogun-command -n 80 --no-pager

Then open the dashboard and confirm the ``Updated`` timestamp advances about
every five seconds. When authenticated, ``/api/system/health`` should report the
Pi hostname because the API reads the machine running the Next.js process.

.. test:: Public root redirects to login
   :id: TEST_PUBLIC_ROOT_REDIRECT
   :status: active
   :owner: Diogo
   :links: SPEC_PUBLIC_HOSTNAME, REQ_GOOGLE_AUTH

   ``curl -I https://your-public-hostname.example.com`` should return ``307`` with location
   ``https://your-public-hostname.example.com/login?callbackUrl=%2F``.

.. test:: Public login loads
   :id: TEST_PUBLIC_LOGIN_200
   :status: active
   :owner: Diogo
   :links: SPEC_PUBLIC_HOSTNAME

   ``curl -I https://your-public-hostname.example.com/login`` should return ``200``.

.. test:: Public API rejects anonymous users
   :id: TEST_PUBLIC_API_401
   :status: active
   :owner: Diogo
   :links: IMPL_AUTH_MIDDLEWARE

   ``curl -i https://your-public-hostname.example.com/api/system/health`` should return
   ``401`` and JSON ``{"error":"Authentication required"}``.
