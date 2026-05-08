Validation
----------

.. test:: Team roster build validation
   :id: TEST_TEAMROSTER_BUILD_VALIDATION
   :status: active
   :owner: Diogo
   :links: REQ_TEAMROSTER_DISPLAYED, REQ_TEAMROSTER_LOCAL_FALLBACK

   ``npm run build`` should compile the Team page and ``/api/team`` route while
   preserving the existing ``TeamManifest`` response shape.
