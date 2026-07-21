import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const target = process.env.WATCHDOG_TARGET || 'http://127.0.0.1:3000/api/health';
const appName = process.env.WATCHDOG_APP_NAME || 'silas-app';
const intervalMs = Number(process.env.WATCHDOG_INTERVAL_MS || 30000);
const failureThreshold = Number(process.env.WATCHDOG_FAILURE_THRESHOLD || 3);
const logFile = process.env.WATCHDOG_LOG_FILE || '/opt/build-with-ai/data/watchdog.log';

let consecutiveFailures = 0;
let restartInFlight = false;

async function log(level, message, meta = {}) {
  const entry = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
  console.log(entry);
  await mkdir(dirname(logFile), { recursive: true });
  await appendFile(logFile, `${entry}\n`, 'utf8');
}

async function restartApp(reason) {
  if (restartInFlight) return;
  restartInFlight = true;
  try {
    await log('error', 'Watchdog restarting app', { appName, reason });
    await execFileAsync('pm2', ['restart', appName, '--update-env']);
    await execFileAsync('pm2', ['save']);
    consecutiveFailures = 0;
    await log('info', 'Watchdog restart completed', { appName });
  } catch (error) {
    await log('error', 'Watchdog restart failed', {
      appName,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    restartInFlight = false;
  }
}

async function check() {
  try {
    const response = await fetch(target, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.text();
      consecutiveFailures += 1;
      await log('warn', 'Health check failed', {
        target,
        status: response.status,
        consecutiveFailures,
        body: body.slice(0, 500),
      });
    } else {
      if (consecutiveFailures > 0) {
        await log('info', 'Health check recovered', { target, consecutiveFailures });
      }
      consecutiveFailures = 0;
    }
  } catch (error) {
    consecutiveFailures += 1;
    await log('error', 'Health check request failed', {
      target,
      consecutiveFailures,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (consecutiveFailures >= failureThreshold) {
    await restartApp(`healthcheck failure threshold reached (${consecutiveFailures})`);
  }
}

await log('info', 'Health watchdog started', {
  target,
  appName,
  intervalMs,
  failureThreshold,
  logFile,
});

await check();
setInterval(() => {
  void check();
}, intervalMs);
