#!/usr/bin/env bash
#
# Deploy the IOEA site to AlwaysData and restart the Node.js site.
#
# What it does:
#   1. SSH into AlwaysData, then git pull + pnpm install + pnpm build
#      (prebuild runs prisma generate).
#   2. Restart the Node.js site via the AlwaysData REST API, which closes the
#      500-error window that otherwise stays open between the build finishing
#      and a manual "Restart" click in the panel.
#
# The API key is not stored in this repo. It is read from, in order:
#   1. $ALWAYSDATA_API_KEY
#   2. ~/.config/alwaysdata/api-key   (chmod 600)
#
# Usage:
#   ./scripts/deploy.sh             # full deploy: build + restart
#   ./scripts/deploy.sh --restart   # restart only (skip build)
#
set -euo pipefail

SSH_HOST="${ALWAYSDATA_SSH_HOST:-govanalytics@ssh-govanalytics.alwaysdata.net}"
APP_DIR="${ALWAYSDATA_APP_DIR:-ioea/ioea_kit}"
ACCOUNT="${ALWAYSDATA_ACCOUNT:-govanalytics}"
SITE_ID="${ALWAYSDATA_SITE_ID:-1001434}"
KEY_FILE="${ALWAYSDATA_KEY_FILE:-$HOME/.config/alwaysdata/api-key}"

API_KEY="${ALWAYSDATA_API_KEY:-}"
if [[ -z "$API_KEY" && -f "$KEY_FILE" ]]; then
	API_KEY="$(tr -d '[:space:]' < "$KEY_FILE")"
fi
if [[ -z "$API_KEY" ]]; then
	echo "ERROR: no AlwaysData API key. Set \$ALWAYSDATA_API_KEY or create $KEY_FILE" >&2
	exit 1
fi

if [[ "${1:-}" != "--restart" ]]; then
	echo ">> Building on AlwaysData ($SSH_HOST:~/$APP_DIR)..."
	ssh "$SSH_HOST" "cd ~/$APP_DIR && git pull --ff-only origin main && pnpm install --frozen-lockfile && pnpm build"
fi

echo ">> Restarting site $SITE_ID via AlwaysData API..."
http_code="$(curl -fsS -o /dev/null -w '%{http_code}' \
	-u "$API_KEY account=$ACCOUNT:" \
	-X POST "https://api.alwaysdata.com/v1/site/$SITE_ID/restart/")"

echo ">> Restart request returned HTTP $http_code"
echo ">> Done. https://www.ioea.eu/"
