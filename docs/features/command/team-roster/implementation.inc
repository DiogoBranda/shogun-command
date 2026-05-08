Implementation
--------------

.. impl:: Team roster server module
   :id: IMPL_TEAMROSTER_SERVER_MODULE
   :status: active
   :owner: Codex
   :links: ARCH_TEAMROSTER_FEATURE_BOUNDARY

   ``features/command/team-roster/server.ts`` reads
   ``config/team.local.json`` or writes the built-in fallback manifest when the
   local file is missing.

.. impl:: Team roster page component
   :id: IMPL_TEAMROSTER_PAGE_COMPONENT
   :status: active
   :owner: Codex
   :links: REQ_TEAMROSTER_DISPLAYED

   ``features/command/team-roster/components/team-roster-page.tsx`` renders the
   Team page while ``app/(command)/team/page.tsx`` only exports the route
   entrypoint.
