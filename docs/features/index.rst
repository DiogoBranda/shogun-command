Feature Documentation
=====================

Feature docs are organized by domain and feature. Each feature renders as one
complete page built from included ``.inc`` files so the structure stays tidy
without making readers jump between pages.

New Feature Template
--------------------

Copy ``docs/features/_template/feature`` to
``docs/features/<domain>/<feature>`` and replace the placeholders. Add only the
new feature's ``index.rst`` to a domain or feature toctree; do not add the
``.inc`` files directly.

Feature Domains
---------------

Add domain pages here as real feature documentation is introduced.

.. toctree::
   :maxdepth: 2
   :caption: Domains
