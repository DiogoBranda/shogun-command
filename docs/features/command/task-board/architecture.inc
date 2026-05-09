Architecture
------------

Static Structure
~~~~~~~~~~~~~~~~

.. arch:: Task board configuration boundary
   :id: ARCH_TASKBOARD_CONFIG_BOUNDARY
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_LOCAL_TASKS_DISPLAYED, REQ_TASKBOARD_PUBLIC_SCHEMA_EXAMPLE

   The task board separates private local state from committed public schema
   documentation.

   .. include:: diagrams/static-structure.mmd.inc

   The route entrypoint renders the task board page component. The page reads a
   manifest from the server module, which loads and validates the ignored local
   JSON file. The committed example JSON is not used as runtime data; it is the
   public contract that contributors can inspect safely.

Sequence
~~~~~~~~

.. arch:: Task board load sequence
   :id: ARCH_TASKBOARD_LOAD_SEQUENCE
   :status: active
   :owner: Diogo
   :links: REQ_TASKBOARD_TASK_CONFIG_VALIDATED, REQ_TASKBOARD_SAFE_FALLBACK

   The load path validates task data before the UI receives it.

   .. include:: diagrams/load-sequence.mmd.inc

   Missing local configuration is created from the built-in fallback. Invalid
   local configuration is reported with a concise server warning and replaced
   with fallback data for the render.
