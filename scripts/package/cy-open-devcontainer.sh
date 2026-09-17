#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider
export DISPLAY=:99
concurrently --kill-others \
    "Xvfb :99 -screen 0 1920x1080x24 -ac -listen tcp" \
    "wait-on tcp:localhost:6099 && openbox" \
    "wait-on tcp:localhost:6099 && x11vnc -display :99 -forever -nopw -quiet -rfbport 5900" \
    "/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080" \
    "yarn start:forCypress" \
    "wait-on 'http-get://127.0.0.1:3000' tcp:localhost:6099 && cypress open" \
    "wait-on 'http-get://127.0.0.1:3000' tcp:localhost:6099 && until pgrep -f '.cache/Cypress' > /dev/null 2>&1; do sleep 0.5; done && echo 'Cypress interface: http://localhost:6080/vnc.html' && sleep infinity"
