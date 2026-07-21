# SSL + Uptime Runbook for buildwithai.digital

## Root cause confirmed
The server at `65.109.7.159` currently serves a certificate with:
- CN: `silas.buildwithai.digital`
- SAN: `silas.buildwithai.digital`

So requests to `https://buildwithai.digital` fail with `ERR_CERT_COMMON_NAME_INVALID`.

## Immediate fix (Nginx + Let's Encrypt)
On the production server:

```bash
cd /opt/build-with-ai
LETSENCRYPT_EMAIL=ops@buildwithai.digital bash scripts/setup-ssl-buildwithai.sh
```

This will:
- configure Nginx vhosts for `buildwithai.digital` and `www.buildwithai.digital`
- request/install a Let's Encrypt cert for both domains
- force HTTP -> HTTPS redirect
- reload Nginx safely

## Verify
```bash
openssl s_client -servername buildwithai.digital -connect buildwithai.digital:443 </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
curl -I https://buildwithai.digital/
```

Expected SAN includes:
- `DNS:buildwithai.digital`
- `DNS:www.buildwithai.digital`

## Keep site up (recommended)
1. Keep app process managed by PM2/systemd with restart policy.
2. Keep Nginx enabled with `Restart=always` in systemd.
3. Run SSL + HTTPS monitor every 5 minutes.

Boot persistence for the web app:

```bash
cd /opt/build-with-ai
pm2 startOrRestart ecosystem.config.cjs --only build-with-ai-web --update-env
bash scripts/setup-pm2-startup.sh
```

This wires the checked-in PM2 app definition into systemd so `build-with-ai-web` is restored after reboots.

Example cron:
```bash
*/5 * * * * /opt/build-with-ai/scripts/check-ssl-health.sh buildwithai.digital >> /var/log/buildwithai-ssl.log 2>&1
```

## Optional DNS hardening
- Keep `A` records for both apex and `www` pointing to production IP.
- If using Cloudflare, set SSL mode to `Full (strict)` and ensure origin cert matches origin hostname.

## Operational note
No setup can guarantee 100% uptime, but this configuration materially reduces downtime risk by combining automated cert renewal checks, process supervision, and health monitoring.
