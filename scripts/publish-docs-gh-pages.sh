#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="${ROOT_DIR}/docs"
BUILD_DIR="${DOCS_BUILD_DIR:-${DOCS_DIR}/_build/html}"
DOCTREE_DIR="${DOCS_DOCTREE_DIR:-${DOCS_DIR}/_build/doctrees}"
PUBLISH_BRANCH="${PUBLISH_BRANCH:-gh-pages}"
REMOTE="${REMOTE:-origin}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-Publish documentation}"
PUBLISH_DIR="$(mktemp -d "${TMPDIR:-/tmp}/shogun-docs-publish.XXXXXX")"

cleanup() {
  git -C "${ROOT_DIR}" worktree remove --force "${PUBLISH_DIR}" >/dev/null 2>&1 || true
  rm -rf "${PUBLISH_DIR}"
}
trap cleanup EXIT

echo "Building Sphinx docs..."
"${DOCS_DIR}/.venv/bin/sphinx-build" -b html -d "${DOCTREE_DIR}" "${DOCS_DIR}" "${BUILD_DIR}"

echo "Preparing ${PUBLISH_BRANCH} worktree..."
if git -C "${ROOT_DIR}" show-ref --verify --quiet "refs/heads/${PUBLISH_BRANCH}"; then
  git -C "${ROOT_DIR}" worktree add --detach "${PUBLISH_DIR}" "${PUBLISH_BRANCH}"
elif git -C "${ROOT_DIR}" show-ref --verify --quiet "refs/remotes/${REMOTE}/${PUBLISH_BRANCH}"; then
  git -C "${ROOT_DIR}" worktree add --detach "${PUBLISH_DIR}" "${REMOTE}/${PUBLISH_BRANCH}"
else
  git -C "${ROOT_DIR}" worktree add --detach "${PUBLISH_DIR}" HEAD
fi

find "${PUBLISH_DIR}" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
rsync -a --delete \
  --exclude='.git' \
  --exclude='.doctrees' \
  --exclude='.buildinfo.bak' \
  "${BUILD_DIR}/" "${PUBLISH_DIR}/"
touch "${PUBLISH_DIR}/.nojekyll"

git -C "${PUBLISH_DIR}" add -A
TREE_ID="$(git -C "${PUBLISH_DIR}" write-tree)"
COMMIT_ID="$(printf '%s\n' "${COMMIT_MESSAGE}" | git -C "${PUBLISH_DIR}" commit-tree "${TREE_ID}")"

git -C "${ROOT_DIR}" update-ref "refs/heads/${PUBLISH_BRANCH}" "${COMMIT_ID}"

echo "Force-pushing ${PUBLISH_BRANCH} as one generated commit..."
git -C "${ROOT_DIR}" push --force "${REMOTE}" "${PUBLISH_BRANCH}:${PUBLISH_BRANCH}"

echo "Published ${COMMIT_ID} to ${REMOTE}/${PUBLISH_BRANCH}."
