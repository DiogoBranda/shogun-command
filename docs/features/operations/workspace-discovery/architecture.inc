Architecture
------------

.. arch:: Workspace discovery feature boundary
   :id: ARCH_WORKSPACE_FEATURE_BOUNDARY
   :status: active
   :owner: Diogo
   :links: REQ_WORKSPACE_ROOTS_DISCOVERED, REQ_WORKSPACE_CANDIDATES_SUMMARIZED

   ``features/operations/workspace-discovery`` owns the filesystem scan and
   response types. It reads configured roots and candidate names from
   ``lib/config.ts`` and exposes the same discovery shape to the dashboard and
   ``/api/workspace/discovery``.
