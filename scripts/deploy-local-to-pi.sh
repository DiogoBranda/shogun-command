#!/usr/bin/env bash
set -euo pipefail

PI_SSH="${PI_SSH:-}"
PI_APP_DIR="${PI_APP_DIR:-}"
SERVICE_NAME="${SERVICE_NAME:-shogun-command}"
DEPLOY_DOCS="${DEPLOY_DOCS:-0}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -z "${PI_SSH}" || -z "${PI_APP_DIR}" ]]; then
  cat >&2 <<'EOF'
Missing deploy target.

Set both variables before running this script:

  PI_SSH=<PI_USER>@<PI_SSH_HOST> PI_APP_DIR=/home/<PI_USER>/shogun-command npm run deploy:local

EOF
  exit 2
fi

RSYNC_EXCLUDES=(
  "--exclude=.git"
  "--exclude=.next"
  "--exclude=.agents"
  "--exclude=.codex"
  "--exclude=node_modules"
  "--exclude=out"
  "--exclude=.env.local"
  "--exclude=.env.production"
  "--exclude=*.local.md"
  "--exclude=npm-debug.log*"
  "--exclude=tsconfig.tsbuildinfo"
  "--exclude=*:Zone.Identifier"
  "--exclude=config/*.local.json"
  "--exclude=docs/.venv"
  "--exclude=docs/_build"
  "--exclude=docs/ideas"
)

if [[ "${DEPLOY_DOCS}" != "1" ]]; then
  RSYNC_EXCLUDES+=("--exclude=docs")
fi

echo "Running local checks..."
cd "${ROOT_DIR}"
npx tsc --noEmit
npm run lint

echo "Syncing source to ${PI_SSH}:${PI_APP_DIR}/..."
rsync -az --delete "${RSYNC_EXCLUDES[@]}" "${ROOT_DIR}/" "${PI_SSH}:${PI_APP_DIR}/"

echo "Installing, building, and restarting on Pi..."
ssh "${PI_SSH}" "cd '${PI_APP_DIR}' && npm ci && npm run build && sudo systemctl restart '${SERVICE_NAME}' && sudo systemctl status '${SERVICE_NAME}' --no-pager -l && sudo journalctl -u '${SERVICE_NAME}' -n 80 --no-pager"

echo "Deploy complete."
