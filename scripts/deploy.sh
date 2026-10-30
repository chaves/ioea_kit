#!/usr/bin/env bash
# Deploy to AlwaysData with the procedure shared by every site:
# _script/deploy.sh at the root of SITES_NODE_ALWAYSDATA, site "ioea-public" in _script/sites.conf.
# Options: --restart, --no-env, --no-post (alias --no-migrate), --dry-run
exec "$(dirname "$0")/../../../_script/deploy.sh" ioea-public "$@"
