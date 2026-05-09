Overview
--------

Introduction
~~~~~~~~~~~~

Task Board is the operational work queue for Shogun Command. It keeps active
work visible inside the authenticated command UI without requiring private task
details to be committed to the public repository.

The feature treats ``config/tasks.local.json`` as the private source of truth
and ``config/tasks.example.json`` as the committed schema example.

User Scenario
~~~~~~~~~~~~~

.. scenario:: Operator reviews current work
   :id: SCN_TASKBOARD_OPERATOR_REVIEWS_WORK
   :status: active
   :owner: Diogo

   An authenticated operator opens the Tasks page and reviews work by lane,
   priority, status, area, next action, and related links.

Use Case
~~~~~~~~

.. usecase:: Operator maintains the private work queue
   :id: UC_TASKBOARD_PRIVATE_QUEUE_UPKEEP
   :status: active
   :owner: Diogo
   :links: SCN_TASKBOARD_OPERATOR_REVIEWS_WORK

   **Actors**

   * Operator
   * Shogun Command
   * Local task configuration

   **Preconditions**

   * The operator can access authenticated command pages.
   * ``config/tasks.local.json`` exists or can be generated locally.
   * Private task details are not committed.

   **Expectations**

   * Real tasks are read from ``config/tasks.local.json``.
   * The public repository contains only the sanitized example schema.
   * Malformed task files are caught by a lightweight check.
   * The UI remains usable even if local task data is temporarily invalid.

Functional Requirements
~~~~~~~~~~~~~~~~~~~~~~~

.. req:: Task board displays private local tasks
   :id: REQ_TASKBOARD_LOCAL_TASKS_DISPLAYED
   :status: active
   :owner: Diogo
   :links: UC_TASKBOARD_PRIVATE_QUEUE_UPKEEP

   Shogun Command must display tasks from ``config/tasks.local.json`` grouped by
   lane, with status, priority, area, summary, next action, and links.

.. req:: Task board keeps public schema separate
   :id: REQ_TASKBOARD_PUBLIC_SCHEMA_EXAMPLE
   :status: active
   :owner: Diogo
   :links: UC_TASKBOARD_PRIVATE_QUEUE_UPKEEP

   The repository must include a sanitized ``config/tasks.example.json`` that
   documents the public task shape without real private task data.

.. req:: Task board validates task configuration
   :id: REQ_TASKBOARD_TASK_CONFIG_VALIDATED
   :status: active
   :owner: Diogo
   :links: UC_TASKBOARD_PRIVATE_QUEUE_UPKEEP

   Task configuration must be checked for required fields, allowed enums, link
   shape, and parseable JSON before it is trusted.

.. req:: Task board has safe fallback behavior
   :id: REQ_TASKBOARD_SAFE_FALLBACK
   :status: active
   :owner: Diogo
   :links: UC_TASKBOARD_PRIVATE_QUEUE_UPKEEP

   If the local task file is missing or invalid, the task board must remain
   renderable using a built-in fallback task.
