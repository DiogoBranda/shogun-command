Architecture
------------

Static Structure
~~~~~~~~~~~~~~~~

Use this section for the important classes, modules, routes, services, or data
stores involved in the feature.

.. mermaid::

   flowchart LR
     Entry["Feature entrypoint"] --> Module["Module or component"]
     Module --> State["State or external dependency"]

.. arch:: Feature structure is understandable
   :id: ARCH_TEMPLATE_FEATURE_STRUCTURE
   :status: draft
   :owner: Unassigned
   :links: REQ_TEMPLATE_FEATURE_BEHAVIOR

   Explain the static structure behind the feature.

Sequence
~~~~~~~~

Use this section for the main runtime flow.

.. mermaid::

   sequenceDiagram
     actor User
     participant UI
     participant System
     User->>UI: Starts feature workflow
     UI->>System: Requests feature behavior
     System-->>UI: Returns result
     UI-->>User: Shows outcome
