project = "Shogun Command"
author = "Diogo Brandao"
copyright = "2026, Diogo Brandao"

extensions = [
    "sphinx_needs",
    "sphinxcontrib.mermaid",
]

templates_path = ["_templates"]
exclude_patterns = [".venv", "_build", "Thumbs.db", ".DS_Store"]

html_theme = "alabaster"
html_title = "Shogun Command Docs"

needs_types = [
    dict(directive="req", title="Requirement", prefix="REQ_", color="#BFD8D2", style="node"),
    dict(directive="spec", title="Specification", prefix="SPEC_", color="#FEDCD2", style="node"),
    dict(directive="impl", title="Implementation", prefix="IMPL_", color="#DF744A", style="node"),
    dict(directive="test", title="Test", prefix="TEST_", color="#DCB239", style="node"),
]

needs_id_required = True
needs_id_regex = "^[A-Z0-9_]{5,}"
needs_show_link_type = True
needs_fields = {
    "owner": {
        "description": "Person or agent responsible for the need",
        "schema": {
            "type": "string"
        }
    }
}
