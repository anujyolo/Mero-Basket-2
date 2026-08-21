# Hackathon 2.0

Working repository for the Hackathon 2.0 project.

## Backup routine

At the start of a work session, update your local copy:

```sh
git pull --rebase
```

Save and push a checkpoint whenever you finish a useful milestone:

```sh
./scripts/backup.sh "backup: describe what changed"
```

For automatic checkpoints once an hour while you work, keep this running in a
terminal:

```sh
./scripts/backup-every-hour.sh
```

Press `Ctrl+C` to stop the hourly loop. It only creates a commit when files have
changed, but it always tries to push any local commits that have not reached
GitHub yet.

Common secrets and local-only files are excluded by `.gitignore`. Keep real API
keys in `.env`; commit only a safe `.env.example` containing placeholder values.
