# Shogun Command

Private mission-control dashboard for a personal agent and home automation system.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Documentation

The main docs are Sphinx docs with `sphinx-needs` traceability and diagrams.

```bash
cd docs
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
sphinx-build -b html . _build/html
```

Open `docs/_build/html/index.html`.

Private planning notes and screenshots stay local under `docs/ideas/` and are not published.
