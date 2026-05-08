Implementation
--------------

.. impl:: Workspace discovery server module
   :id: IMPL_WORKSPACE_SERVER_MODULE
   :status: active
   :owner: Codex
   :links: ARCH_WORKSPACE_FEATURE_BOUNDARY

   ``features/operations/workspace-discovery/server.ts`` safely stats each
   configured root and candidate file. Missing and unreadable paths are reported
   as missing rather than failing the dashboard render.
