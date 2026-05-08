Implementation
--------------

.. impl:: System health server module
   :id: IMPL_SYSHEALTH_SERVER_MODULE
   :status: active
   :owner: Codex
   :links: ARCH_SYSHEALTH_FEATURE_BOUNDARY

   ``features/operations/system-health/server.ts`` reads OS state with Node
   APIs and small host commands. It preserves the existing ``SystemHealth`` and
   ``ServiceState`` response shapes.

.. impl:: System health dashboard component
   :id: IMPL_SYSHEALTH_DASHBOARD_COMPONENT
   :status: active
   :owner: Codex
   :links: REQ_SYSHEALTH_SAME_ORIGIN_REFRESH

   ``features/operations/system-health/components/system-dashboard.tsx`` renders
   the Mission Control health UI and refreshes ``/api/system/health`` and
   ``/api/system/services`` every five seconds.
