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

Private task data stays local in `config/tasks.local.json`, which is ignored by
git. The committed `config/tasks.example.json` file documents the public task
shape; run `npm run tasks:check` after editing either task file.

To deploy private local config to the Pi production app, opt in explicitly:

```bash
DEPLOY_LOCAL_CONFIG=1 PI_SSH=<PI_USER>@<PI_SSH_HOST> PI_APP_DIR=/home/<PI_USER>/shogun-command npm run deploy:local
```
