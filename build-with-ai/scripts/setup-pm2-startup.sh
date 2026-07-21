#!/usr/bin/env bash
set -euo pipefail

PM2_BIN=${PM2_BIN:-/usr/lib/node_modules/pm2/bin/pm2}
NODE_BIN_DIR=${NODE_BIN_DIR:-/home/ajay/.nvm/versions/node/v20.20.1/bin}
PM2_USER=${PM2_USER:-ajay}
PM2_HOME_DIR=${PM2_HOME_DIR:-/home/ajay}

sudo env PATH="$PATH:${NODE_BIN_DIR}" "${PM2_BIN}" startup systemd -u "${PM2_USER}" --hp "${PM2_HOME_DIR}"
pm2 save

echo "PM2 startup configured for ${PM2_USER}."