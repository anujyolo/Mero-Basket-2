#!/usr/bin/env bash
set -u

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
interval="${BACKUP_INTERVAL_SECONDS:-3600}"

if ! [[ "$interval" =~ ^[1-9][0-9]*$ ]]; then
  echo "BACKUP_INTERVAL_SECONDS must be a positive whole number." >&2
  exit 1
fi

echo "Hourly GitHub backups are running. Press Ctrl+C to stop."

while true; do
  if ! "$script_dir/backup.sh"; then
    echo "Checkpoint failed; the next attempt will run in ${interval} seconds." >&2
  fi
  sleep "$interval"
done
