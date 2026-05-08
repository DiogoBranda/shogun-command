project = "Shogun Command"
author = "Diogo Brandao"
copyright = "2026, Diogo Brandao"

extensions = [
    "sphinx_needs",
    "sphinxcontrib.mermaid",
]

templates_path = ["_templates"]
exclude_patterns = [".venv", "_build", "Thumbs.db", ".DS_Store"]

html_theme = "furo"
html_title = "Shogun Command Docs"
html_static_path = ["_static"]
html_css_files = ["shogun.css"]
html_theme_options = {
    "light_css_variables": {
        "color-brand-primary": "#0d1728",
        "color-brand-content": "#0d1728",
    },
    "dark_css_variables": {
        "color-brand-primary": "#77c4ff",
        "color-brand-content": "#22f5c8",
    },
}
pygments_style = "sphinx"
pygments_dark_style = "monokai"

needs_types = [
    dict(directive="scenario", title="User Scenario", prefix="SCN_", color="#77c4ff", style="node"),
    dict(directive="usecase", title="Use Case", prefix="UC_", color="#9c6cff", style="node"),
    dict(directive="req", title="Functional Requirement", prefix="REQ_", color="#22f5c8", style="node"),
    dict(directive="arch", title="Architecture Note", prefix="ARCH_", color="#ffd166", style="node"),
    dict(directive="impl", title="Implementation Note", prefix="IMPL_", color="#df7cff", style="node"),
    dict(directive="test", title="Validation", prefix="TEST_", color="#ff4d68", style="node"),
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
