Validation
----------

.. test:: Workspace discovery build validation
   :id: TEST_WORKSPACE_BUILD_VALIDATION
   :status: active
   :owner: Diogo
   :links: REQ_WORKSPACE_ROOTS_DISCOVERED, REQ_WORKSPACE_CANDIDATES_SUMMARIZED

   ``npm run build`` should compile the workspace discovery feature and route
   handler while preserving the existing ``WorkspaceDiscovery`` response shape.
