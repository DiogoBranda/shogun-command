Architecture
------------

.. arch:: System health feature boundary
   :id: ARCH_SYSHEALTH_FEATURE_BOUNDARY
   :status: active
   :owner: Diogo
   :links: REQ_SYSHEALTH_HOST_REPORTED, REQ_SYSHEALTH_SERVICES_REPORTED, REQ_SYSHEALTH_SAME_ORIGIN_REFRESH

   ``features/operations/system-health`` owns the server readers, response
   types, and Mission Control dashboard component for system health. The
   Next.js route handlers under ``app/api/system`` stay thin and only serialize
   the feature output.
