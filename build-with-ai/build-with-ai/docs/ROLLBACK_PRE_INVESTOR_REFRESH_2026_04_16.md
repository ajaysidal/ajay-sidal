# Pre-Investor Refresh Rollback Notes

A full rollback archive was created before the investor-facing redesign work:

- Backup file: `.backups/PRE_INVESTOR_REFRESH_20260416_040524.tar.gz`
- Created on: 2026-04-16

## Restore approach

From the workspace root, extract the archive into a safe location first:

```bash
mkdir -p /tmp/build-with-ai-restore
cd /tmp/build-with-ai-restore
tar -xzf /opt/build-with-ai/.backups/PRE_INVESTOR_REFRESH_20260416_040524.tar.gz
```

Then compare or restore the snapshot back into the live workspace as needed.

## Recommended restore workflow

1. Stop the running app process.
2. Extract the archive to a temporary folder.
3. Compare against the current workspace.
4. Copy the desired snapshot back into `/opt/build-with-ai`.
5. Restart the application.
