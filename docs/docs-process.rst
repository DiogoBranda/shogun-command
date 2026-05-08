Documentation Process
=====================

Shogun Command documentation uses a lightweight feature process inspired by
structured ASPICE documentation, but optimized for reading one feature end to
end on a single page.

Documentation Shape
-------------------

Feature documentation lives under a domain and feature folder:

.. code-block:: text

   docs/features/<domain>/<feature>/
     index.rst
     overview.inc
     architecture.inc
     implementation.inc
     tests.inc

The ``index.rst`` file is the only page added to a toctree. It owns the title,
a short feature introduction, and includes the ``.inc`` files in reading order.
The included files keep authors organized without splitting the reader across
several pages.

Feature Sections
----------------

``overview.inc``
   Explains the feature intent, the user scenario, the main use case, and the
   functional requirements that describe externally visible behavior.

``architecture.inc``
   Shows the static structure and runtime interactions. Prefer Mermaid diagrams
   when a diagram makes the feature easier to understand.

``implementation.inc``
   Explains how the feature is implemented in practical engineering language.
   This is intentionally not a low-level technical requirements section.

``tests.inc``
   Describes validation scenarios and stores the feature-level ``TEST_``
   objects that prove externally visible behavior.

Linking Rules
-------------

Use links at feature level. Every feature should connect the important objects
that explain why the code exists and how it is validated, but not every
paragraph needs a formal Sphinx Needs object.

Use stable IDs with the configured prefixes:

* ``SCN_`` for user scenarios.
* ``UC_`` for use cases.
* ``REQ_`` for functional requirements.
* ``ARCH_`` for architecture notes.
* ``IMPL_`` for implementation explanations.
* ``TEST_`` for validation.

Change Checklist
----------------

When a change introduces or significantly changes a feature:

* Add or update the feature page under the right domain.
* Update user scenarios, use cases, and functional requirements when behavior
  changes.
* Update architecture diagrams when modules, boundaries, or runtime flows
  change.
* Update implementation notes when the explanation would help a future human or
  agent maintain the feature.
* Update tests and links when scenarios, requirements, architecture notes, or
  validation checks are added or removed.
* Keep private usernames, hostnames, tokens, passwords, and local-only notes out
  of tracked documentation.
