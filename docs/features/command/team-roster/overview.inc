Overview
--------

User Scenario
~~~~~~~~~~~~~

.. scenario:: Operator reviews the command team
   :id: SCN_TEAMROSTER_OPERATOR_REVIEWS_TEAM
   :status: active
   :owner: Diogo

   An authenticated operator opens the Team page and reviews the mission,
   commander, chief of staff, and branch roster from local configuration.

Functional Requirements
~~~~~~~~~~~~~~~~~~~~~~~

.. req:: Team roster is displayed
   :id: REQ_TEAMROSTER_DISPLAYED
   :status: active
   :owner: Diogo
   :links: SCN_TEAMROSTER_OPERATOR_REVIEWS_TEAM

   Shogun Command must display the team manifest with mission text, command
   roles, branch members, status, cadence, callsign, and source.

.. req:: Team roster has a local fallback
   :id: REQ_TEAMROSTER_LOCAL_FALLBACK
   :status: active
   :owner: Diogo
   :links: SCN_TEAMROSTER_OPERATOR_REVIEWS_TEAM

   Shogun Command must create or use a local generated team configuration when
   no host-specific roster exists.
