Validation
----------

.. test:: Task config schema check validates task files
   :id: TEST_TASKBOARD_CONFIG_SCHEMA_CHECK
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_PUBLIC_SCHEMA_EXAMPLE, REQ_TASKBOARD_TASK_CONFIG_VALIDATED

   ``npm run tasks:check`` should validate ``config/tasks.example.json`` and
   the optional private ``config/tasks.local.json`` without printing private
   task contents.

.. test:: Task board build validation
   :id: TEST_TASKBOARD_BUILD_VALIDATION
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_LOCAL_TASKS_DISPLAYED, REQ_TASKBOARD_SAFE_FALLBACK

   ``npm run build`` should compile the Tasks page while preserving the
   existing ``TaskManifest`` response shape and safe fallback behavior.

.. test:: Task board documentation builds
   :id: TEST_TASKBOARD_DOCS_BUILD
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_PUBLIC_SCHEMA_EXAMPLE

   ``npm run docs:build`` should render the Task Board feature page, included
   diagrams, and linked traceability items.
