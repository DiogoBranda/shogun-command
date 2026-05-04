#!/usr/bin/env bash
set -euo pipefail

PI_APP_DIR="${PI_APP_DIR:-$(pwd)}"
SERVICE_NAME="${SERVICE_NAME:-shogun-command}"
GIT_REMOTE="${GIT_REMOTE:-origin}"
GIT_BRANCH="${GIT_BRANCH:-main}"

echo "Deploying ${GIT_REMOTE}/${GIT_BRANCH} in ${PI_APP_DIR}..."
cd "${PI_APP_DIR}"

git fetch "${GIT_REMOTE}" "${GIT_BRANCH}"
git pull --ff-only "${GIT_REMOTE}" "${GIT_BRANCH}"
npm ci
npm run build

sudo systemctl restart "${SERVICE_NAME}"
sudo systemctl status "${SERVICE_NAME}" --no-pager -l
sudo journalctl -u "${SERVICE_NAME}" -n 80 --no-pager

echo "Deploy complete."
