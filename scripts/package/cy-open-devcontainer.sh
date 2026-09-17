#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider
export DISPLAY=:99

# Read the DHIS2 base URL from environment or .env.cypress* files (local takes precedence)
DHIS2_URL="${CYPRESS_dhis2BaseUrl:-$(grep -h '^CYPRESS_dhis2BaseUrl=' .env.cypress.local .env.cypress 2>/dev/null | head -1 | cut -d= -f2-)}"

CMDS=(
    "Xvfb :99 -screen 0 1920x1080x24 -ac -listen tcp"
    "wait-on tcp:localhost:6099 && openbox"
    "wait-on tcp:localhost:6099 && x11vnc -display :99 -forever -nopw -quiet -rfbport 5900"
    "/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080"
    "yarn start:forCypress"
)

# When testing against a local instance socat tunnels that port from the
# container to the host, making requests same-site so browser cookie
# restrictions don't apply. Not needed for remote (non-localhost) instances.
WAIT_READY="'http-get://127.0.0.1:3000' tcp:localhost:6099"
if [[ "$DHIS2_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:[0-9]+)? ]]; then
    PORT=$(echo "$DHIS2_URL" | grep -oE ':[0-9]+' | head -1 | tr -d ':')
    PORT=${PORT:-80}
    CMDS+=("socat TCP-LISTEN:${PORT},fork,reuseaddr TCP:host.docker.internal:${PORT}")
    WAIT_READY="$WAIT_READY tcp:localhost:${PORT}"
fi

CMDS+=(
    "wait-on ${WAIT_READY} && cypress open"
    "wait-on ${WAIT_READY} && until pgrep -f '.cache/Cypress' > /dev/null 2>&1; do sleep 0.5; done && echo 'Cypress interface: http://localhost:6080/vnc.html' && sleep infinity"
)

concurrently --kill-others "${CMDS[@]}"
