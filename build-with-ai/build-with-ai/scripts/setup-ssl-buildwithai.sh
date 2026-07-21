#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${1:-buildwithai.digital}
WWW_DOMAIN=${2:-www.buildwithai.digital}
UPSTREAM=${UPSTREAM:-127.0.0.1:3000}
EMAIL=${LETSENCRYPT_EMAIL:-}

if [[ -z "$EMAIL" ]]; then
  echo "LETSENCRYPT_EMAIL is required"
  echo "Example: LETSENCRYPT_EMAIL=ops@buildwithai.digital bash scripts/setup-ssl-buildwithai.sh"
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "nginx is not installed"
  exit 1
fi

if ! command -v certbot >/dev/null 2>&1; then
  echo "certbot is not installed"
  echo "Debian/Ubuntu: sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx"
  exit 1
fi

sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

cat <<NGINX_CONF | sudo tee /etc/nginx/sites-available/${DOMAIN}.conf >/dev/null
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
      return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://${UPSTREAM};
        proxy_http_version 1.1;
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
    }
}
NGINX_CONF

sudo ln -sf /etc/nginx/sites-available/${DOMAIN}.conf /etc/nginx/sites-enabled/${DOMAIN}.conf

sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx \
  -d "${DOMAIN}" \
  -d "${WWW_DOMAIN}" \
  --non-interactive \
  --agree-tos \
  -m "${EMAIL}" \
  --redirect

sudo nginx -t
sudo systemctl reload nginx

echo "SSL configured for ${DOMAIN} and ${WWW_DOMAIN}"
echo "Verify: openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 </dev/null 2>/dev/null | openssl x509 -noout -subject -ext subjectAltName"
