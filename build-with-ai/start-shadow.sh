#!/bin/bash
source .shadow/.env.shadow
export SHADOW_ENV=true
npm run start -- -p 3001 --hostname 127.0.0.1
