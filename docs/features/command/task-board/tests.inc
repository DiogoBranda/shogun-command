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

.. test:: Task board UI renders validated fixture data
   :id: TEST_TASKBOARD_UI_FIXTURE_RENDER
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_LOCAL_TASKS_DISPLAYED, REQ_TASKBOARD_TASK_CONFIG_VALIDATED, REQ_TASKBOARD_DONE_ARCHIVE

   ``npx playwright test tests/ui/task-board.spec.ts --project=desktop`` should
   render the Tasks page from deterministic E2E fixture data and verify lane
   content, counts, statuses, next actions, task links, and the collapsible
   ``Done`` archive behavior.

.. test:: Task board documentation builds
   :id: TEST_TASKBOARD_DOCS_BUILD
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_PUBLIC_SCHEMA_EXAMPLE

   ``npm run docs:build`` should render the Task Board feature page, included
   diagrams, and linked traceability items.
