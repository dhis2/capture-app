#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider

# Read the DHIS2 base URL from environment or .env.cypress* files (local takes precedence)
DHIS2_URL="${CYPRESS_dhis2BaseUrl:-$(grep -h '^CYPRESS_dhis2BaseUrl=' .env.cypress.local .env.cypress 2>/dev/null | head -1 | cut -d= -f2-)}"

CMDS=("yarn start:forCypress")

# When testing against a local instance socat tunnels that port from the
# container to the host, making requests same-site so browser cookie
# restrictions don't apply. Not needed for remote (non-localhost) instances.
WAIT_READY="'http-get://127.0.0.1:3000'"
if [[ "$DHIS2_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:[0-9]+)? ]]; then
    PORT=$(echo "$DHIS2_URL" | grep -oE ':[0-9]+' | head -1 | tr -d ':')
    PORT=${PORT:-80}
    CMDS+=("socat -d0 TCP-LISTEN:${PORT},fork,reuseaddr TCP:host.docker.internal:${PORT}")
    WAIT_READY="$WAIT_READY tcp:localhost:${PORT}"
fi

CMDS+=("wait-on ${WAIT_READY} && cypress run")

concurrently --kill-others "${CMDS[@]}"
