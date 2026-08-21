#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" ]]; then
  echo "Backup stopped: this folder is not a Git repository." >&2
  exit 1
fi

cd "$repo_root"

if [[ -n "$(git diff --name-only --diff-filter=U)" ]]; then
  echo "Backup stopped: resolve the current merge conflicts first." >&2
  exit 1
fi

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Backup stopped: Git is in a detached HEAD state." >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Backup stopped: the GitHub remote named 'origin' is not configured." >&2
  exit 1
fi

git add -A

staged_names="$(git diff --cached --name-only --diff-filter=ACMR)"
risky_names="$(
  printf '%s\n' "$staged_names" \
    | grep -Eiv '(^|/)\.env\.example$' \
    | grep -Ei '(^|/)(\.env($|\.)|id_rsa($|\.)|id_ed25519($|\.)|credentials?($|\.)|secrets?($|\.))|\.(pem|key|p12|pfx)$' \
    || true
)"

if [[ -n "$risky_names" ]]; then
  echo "Backup stopped: these staged files may contain credentials:" >&2
  printf '  %s\n' "$risky_names" >&2
  echo "Move secrets to an ignored file, then try again." >&2
  exit 1
fi

if ! git diff --cached --quiet; then
  git diff --cached --check

  if [[ $# -gt 0 ]]; then
    message="$*"
  else
    message="backup: checkpoint $(date '+%Y-%m-%d %H:%M:%S %z')"
  fi

  git commit -m "$message"
else
  echo "No file changes to commit. Checking for unpushed commits..."
fi

git push --set-upstream origin "$branch"
