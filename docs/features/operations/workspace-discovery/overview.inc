Overview
--------

User Scenario
~~~~~~~~~~~~~

.. scenario:: Operator sees available local sources
   :id: SCN_WORKSPACE_OPERATOR_SEES_SOURCES
   :status: active
   :owner: Diogo

   An authenticated operator opens Mission Control and sees whether configured
   local workspace roots and important candidate files exist on the host.

Functional Requirements
~~~~~~~~~~~~~~~~~~~~~~~

.. req:: Workspace roots are discovered
   :id: REQ_WORKSPACE_ROOTS_DISCOVERED
   :status: active
   :owner: Diogo
   :links: SCN_WORKSPACE_OPERATOR_SEES_SOURCES

   Shogun Command must report each configured workspace root with path,
   existence, type, file count, size, and modification time.

.. req:: Candidate source files are summarized
   :id: REQ_WORKSPACE_CANDIDATES_SUMMARIZED
   :status: active
   :owner: Diogo
   :links: SCN_WORKSPACE_OPERATOR_SEES_SOURCES

   Shogun Command must scan configured candidate names under existing roots and
   summarize memory, agent, project, and task signals.
