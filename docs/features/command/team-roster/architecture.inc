Architecture
------------

.. arch:: Team roster feature boundary
   :id: ARCH_TEAMROSTER_FEATURE_BOUNDARY
   :status: active
   :owner: Diogo
   :links: REQ_TEAMROSTER_DISPLAYED, REQ_TEAMROSTER_LOCAL_FALLBACK

   ``features/command/team-roster`` owns the team manifest types, local roster
   reader, fallback roster, and Team page component. The ``/team`` page and
   ``/api/team`` route remain thin Next.js entrypoints.
