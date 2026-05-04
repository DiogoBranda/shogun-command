Operations
==========

Daily Checks
------------

.. code-block:: bash

   systemctl status shogun-command --no-pager -l
   systemctl status nginx --no-pager -l
   systemctl status cloudflared --no-pager -l
   journalctl -u shogun-command -n 100 --no-pager

Public health checks:

.. code-block:: bash

   curl -I https://your-public-hostname.example.com
   curl -I https://your-public-hostname.example.com/login
   curl -i https://your-public-hostname.example.com/api/system/health

Expected anonymous public behavior:

* root URL redirects to login.
* login page loads.
* command APIs return ``401``.

Common Problems
---------------

``redirect_uri_mismatch``
~~~~~~~~~~~~~~~~~~~~~~~~~

Google rejected the OAuth callback because the redirect URI sent by the app is
not registered in Google Cloud Console.

Required redirect URI for the public Pi:

.. code-block:: text

   https://your-public-hostname.example.com/api/auth/callback/google

Required redirect URI for local development:

.. code-block:: text

   http://localhost:3000/api/auth/callback/google

``Repository not found`` on GitHub push
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SSH authentication can succeed while the repository URL is still wrong or the
repo has not been created. Check:

.. code-block:: bash

   git remote -v
   ssh -T git@github.com

``nginx/1.24.0 404``
~~~~~~~~~~~~~~~~~~~~

The browser is reaching Nginx directly instead of Next.js. For local dev, use
``http://localhost:3000``. For production, confirm the Shogun Nginx site is
enabled and points at ``127.0.0.1:3000``.

``next: not found``
~~~~~~~~~~~~~~~~~~~

Dependencies are missing locally:

.. code-block:: bash

   npm install

Dashboard values do not update
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The dashboard polls live values every five seconds, but it only reads the
machine running the Next.js process. If the browser is pointed at local
development, it will show local machine state rather than Pi state.

Check:

.. code-block:: bash

   ssh <PI_USER>@<PI_SSH_HOST>
   systemctl status shogun-command --no-pager -l
   journalctl -u shogun-command -n 80 --no-pager

Then confirm:

* the browser is using the Pi public URL, not ``http://localhost:3000``.
* the browser session is authenticated so API polling is allowed.
* the ``Updated`` timestamp advances about every five seconds.
* the Pi network and system clock are healthy.
* the latest deployment restarted ``shogun-command``.

When authenticated, ``/api/system/health`` should return the Pi hostname.

Build Notes
-----------

The Pi production build currently passes. If a local build fails with a terse
``Build failed because of webpack errors`` message, run these first to separate
type/lint issues from Next build internals:

.. code-block:: bash

   npx tsc --noEmit
   npm run lint
   npm run build

Git Hygiene
-----------

Never commit:

* ``.env.local``
* ``.env.production``
* ``node_modules/``
* ``.next/``
* ``config/*.local.json``
* ``tsconfig.tsbuildinfo``

After documentation or deployment edits:

.. code-block:: bash

   git status --short
   git add -A
   git status --short
   git commit -m "Update documentation"
   git push
