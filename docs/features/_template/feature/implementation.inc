Implementation
--------------

Explain how the feature is implemented in practical engineering language. This
section is not a requirements list. Use it to tell the implementation story
step by step, name the important files or modules, and explain the data flow,
constraints, and tradeoffs a future maintainer needs to understand.

Implementation Overview
~~~~~~~~~~~~~~~~~~~~~~~

Start with a short overview of how the feature is built. Explain the main
runtime pieces and why the implementation is shaped this way.

Code Ownership
~~~~~~~~~~~~~~

Describe which files, modules, components, services, or data stores own the
feature behavior.

.. include:: diagrams/implementation-code-map.mmd.inc

After the diagram, explain the responsibilities of the important boxes and how
they collaborate. Prefer a few focused paragraphs over a file-by-file inventory.

Main Implementation Flow
~~~~~~~~~~~~~~~~~~~~~~~~

Explain the main runtime flow in the order it happens.

.. include:: diagrams/implementation-flow.mmd.inc

After the diagram, describe the important decisions, validations, fallback
paths, and side effects. Keep this readable and concrete.

Important Details
~~~~~~~~~~~~~~~~~

Use this section for implementation details that matter but do not fit the main
flow. Examples include configuration, persistence, cache behavior, error
handling, security constraints, or UI state transitions.

Maintenance Notes
~~~~~~~~~~~~~~~~~

Document the small pieces of context that will save future work: where to make
common changes, what not to bypass, and which assumptions the implementation
depends on.
