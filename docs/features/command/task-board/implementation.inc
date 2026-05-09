Implementation
--------------

Implementation Overview
~~~~~~~~~~~~~~~~~~~~~~~

Task Board is implemented as a server-rendered command page backed by a local
JSON manifest. The runtime source is ``config/tasks.local.json``, which is
ignored by git through ``config/*.local.json``. The committed
``config/tasks.example.json`` file exists only to document the public schema.

Code Ownership
~~~~~~~~~~~~~~

``features/command/task-board/server.ts`` owns task loading and fallback
behavior. ``features/command/task-board/schema.ts`` owns the allowed values and
runtime validation. ``features/command/task-board/components/task-board-page.tsx``
owns the visible grouping, cards, status pills, counts, and task links.

.. include:: diagrams/implementation-code-map.mmd.inc

The validation script uses the same schema intent in a dependency-free Node
check so task upkeep can be validated without starting the app.

Main Implementation Flow
~~~~~~~~~~~~~~~~~~~~~~~~

``getTasks()`` reads ``config/tasks.local.json`` and parses it as JSON. The
parsed value is passed to the task schema validator, which confirms the manifest
contains a ``tasks`` array and that each task has the required fields and
allowed enum values.

.. include:: diagrams/load-sequence.mmd.inc

Valid tasks are normalized so missing ``links`` becomes an empty array. If the
file is missing, ``getTasks()`` creates a local fallback manifest. If parsing or
validation fails, the server logs a short warning and returns the built-in
fallback task instead of exposing task details or breaking the Tasks page.

Important Details
~~~~~~~~~~~~~~~~~

Task files use this root shape:

.. code-block:: json

   {
     "tasks": []
   }

Each task supports:

* ``id``: stable unique task identifier.
* ``title``: display title.
* ``status``: one of ``todo``, ``in_progress``, ``blocked``, ``done``,
  ``idea``.
* ``priority``: one of ``critical``, ``high``, ``medium``, ``low``.
* ``area``: one of ``docs``, ``agents``, ``design``, ``frontend``, ``backend``,
  ``security``, ``operations``, ``research``, ``automation``.
* ``lane``: one of ``now``, ``next``, ``later``, ``ideas``.
* ``summary``: short task context for the card.
* ``nextAction``: the next concrete upkeep or implementation step.
* ``links``: optional array of ``label`` and ``href`` objects.

Run the task config check after changing either task file:

.. code-block:: bash

   npm run tasks:check

Maintenance Notes
~~~~~~~~~~~~~~~~~

Keep real planning data, private links, and sensitive context only in
``config/tasks.local.json``. Keep ``config/tasks.example.json`` sanitized and
small enough to explain the shape.

During upkeep, keep current work in ``now``, move completed items to ``done``,
keep ``nextAction`` concrete after each session, and run
``npm run tasks:check`` before relying on the board.
