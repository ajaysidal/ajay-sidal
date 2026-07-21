#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${1:-buildwithai.digital}
MIN_DAYS=${MIN_DAYS:-21}
RESTART_CMD=${RESTART_CMD:-"systemctl reload nginx"}

TMP_CERT=$(mktemp)
trap 'rm -f "$TMP_CERT"' EXIT

if ! timeout 15 openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" </dev/null 2>/dev/null | openssl x509 -out "$TMP_CERT"; then
  echo "[CRITICAL] Unable to fetch certificate for $DOMAIN"
  exit 2
fi

SUBJECT=$(openssl x509 -in "$TMP_CERT" -noout -subject)
SAN=$(openssl x509 -in "$TMP_CERT" -noout -ext subjectAltName)
NOT_AFTER=$(openssl x509 -in "$TMP_CERT" -noout -enddate | cut -d= -f2)

if ! grep -q "DNS:$DOMAIN" <<<"$SAN"; then
  echo "[CRITICAL] Certificate SAN does not include $DOMAIN"
  echo "$SUBJECT"
  echo "$SAN"
  exit 2
fi

EXPIRY_EPOCH=$(date -d "$NOT_AFTER" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

if (( DAYS_LEFT < MIN_DAYS )); then
  echo "[WARN] Certificate expires in ${DAYS_LEFT} days. Attempting renewal."
  certbot renew --quiet --deploy-hook "$RESTART_CMD" || true
fi

if ! curl -fsS --max-time 15 "https://$DOMAIN/api/health" >/dev/null; then
  echo "[CRITICAL] HTTPS health endpoint check failed for $DOMAIN"
  exit 2
fi

echo "[OK] SSL and HTTPS health check passed for $DOMAIN (days left: $DAYS_LEFT)"
