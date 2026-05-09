Codex Context
=============

Dashboard Refresh Update
------------------------

The refresh change moved Mission Control from a purely server-rendered snapshot
to an initial server render plus a client polling layer. The current behavior is:

* ``app/(command)/page.tsx`` gathers the initial system, service, and workspace
  state on the server.
* ``features/operations/system-health/components/system-dashboard.tsx`` owns
  the interactive dashboard and polls ``/api/system/health`` and
  ``/api/system/services`` every five seconds.
* The APIs read the machine running the Next.js process. A local dev server
  reports local machine state; the Pi deployment reports Pi state.

Token-Cost Lesson
-----------------

The highest token-cost part of this task was not the polling code. The costly
work was:

* moving a large duplicated dashboard render tree into a client component
  without changing behavior.
* investigating the terse ``next build`` failure that only reported
  ``Build failed because of webpack errors``.
* proving that the build failure also happened on a clean ``HEAD`` copy, so it
  predated the dashboard refresh change.

For future chats, give Codex this shortcut:

.. code-block:: text

   The dashboard refresh patch split Mission Control into a server page and
   client polling component. If build fails with the terse webpack message,
   first run tsc/lint and compare against clean HEAD before debugging the
   refresh code.

Google ADK Feasibility
----------------------

Google Agent Development Kit is a reasonable research/prototype track for Pi
agents, but it should not be mixed into the production Next.js dashboard yet.
Keep ADK isolated until there is a concrete agent workflow to run.

Current official notes:

* ADK is available for Python, TypeScript, Go, and Java.
* Python ADK requires Python 3.10 or later and can be installed with
  ``pip install google-adk``.
* ADK deployment options include Agent Runtime, Cloud Run, Google Kubernetes
  Engine, and other container-friendly infrastructure.

Recommended first experiment:

* create a separate ``agents/`` prototype later.
* use a Python virtual environment.
* keep API keys in an untracked agent ``.env`` file.
* avoid adding ADK as a dependency of the Next.js dashboard until the prototype
  proves useful.

References:

* https://adk.dev/
* https://adk.dev/get-started/python/
* https://adk.dev/deploy/
