Validation
----------

.. test:: System health build validation
   :id: TEST_SYSHEALTH_BUILD_VALIDATION
   :status: active
   :owner: Diogo
   :links: REQ_SYSHEALTH_HOST_REPORTED, REQ_SYSHEALTH_SERVICES_REPORTED

   ``npm run build`` should compile the system health feature, API routes, and
   dashboard imports without changing public response shapes.

.. test:: System health protected API validation
   :id: TEST_SYSHEALTH_PROTECTED_API
   :status: active
   :owner: Diogo
   :links: REQ_SYSHEALTH_SAME_ORIGIN_REFRESH

   An anonymous request to ``/api/system/health`` should return ``401`` JSON,
   while an authenticated dashboard session should refresh health and services.
