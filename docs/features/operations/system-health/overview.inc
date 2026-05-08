Overview
--------

User Scenario
~~~~~~~~~~~~~

.. scenario:: Operator checks live host readiness
   :id: SCN_SYSHEALTH_OPERATOR_CHECKS_HOST
   :status: active
   :owner: Diogo

   An authenticated operator opens Mission Control and sees current host,
   memory, disk, thermal, load, and service readiness for the machine running
   Shogun Command.

Functional Requirements
~~~~~~~~~~~~~~~~~~~~~~~

.. req:: Host health is reported
   :id: REQ_SYSHEALTH_HOST_REPORTED
   :status: active
   :owner: Diogo
   :links: SCN_SYSHEALTH_OPERATOR_CHECKS_HOST

   Shogun Command must report host identity, uptime, CPU, memory, disk,
   thermal, load, status, notices, and the time the check was performed.

.. req:: Services are reported
   :id: REQ_SYSHEALTH_SERVICES_REPORTED
   :status: active
   :owner: Diogo
   :links: SCN_SYSHEALTH_OPERATOR_CHECKS_HOST

   Shogun Command must report configured service names with active state,
   status text, and diagnostic detail.

.. req:: Health refresh stays same-origin
   :id: REQ_SYSHEALTH_SAME_ORIGIN_REFRESH
   :status: active
   :owner: Diogo
   :links: SCN_SYSHEALTH_OPERATOR_CHECKS_HOST

   Mission Control must refresh system health through protected same-origin API
   routes.
