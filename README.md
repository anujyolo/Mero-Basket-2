# Mero Basket — Factory Operations

A clean-room rebuild of the Mero Basket factory-management experience for
Hackathon 2.0.

The previous factory application is product reference only. No source code,
assets, internal structure, or Git history from that project are used here.

## Run locally

Install dependencies, then start the local preview:

```sh
npm install
npm run dev
```

The application is configured for [http://localhost:3002](http://localhost:3002).

## Quality checks

Run every check before creating a feature commit:

```sh
npm run lint
npm run typecheck
npm run build
```

## ERP dashboard scope

The current screen is an ERP-ready executive dashboard. It is prepared for:

- sales analysis and completed sales
- receiver/customer visibility
- raw materials and finished goods
- production entries
- orders and notifications
- bank balances
- approval requests
- users, audit logs, and rate limits

Live figures are intentionally not fabricated. The dashboard will show real
numbers after the ERP connection details are supplied.

## Delivery order

Features are added and verified one at a time:

1. Project foundation
2. ERP dashboard foundation
3. Authentication and access control
4. Main layout and navigation
5. Live ERP connector
6. Inventory
7. Production
8. Employee management
9. Attendance
10. Reports and exports
11. Settings and integration status

## Backup routine

At the start of a work session, update your local copy:

```sh
git pull --rebase
```

Save and push a checkpoint whenever you finish a useful milestone:

```sh
./scripts/backup.sh "backup: describe what changed"
```

For optional automatic checkpoints once an hour, keep this running in a terminal:

```sh
./scripts/backup-every-hour.sh
```

Press `Ctrl+C` to stop the hourly loop. It only creates a commit when files have
changed, but it always tries to push any local commits that have not reached
GitHub yet.

During the structured feature build, prefer a manual checkpoint after the
feature passes its quality checks so each commit describes a real milestone.

Common secrets and local-only files are excluded by `.gitignore`. Keep real API
keys in `.env`; commit only a safe `.env.example` containing placeholder values.
