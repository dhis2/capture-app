#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider
concurrently --kill-others \
    "yarn start:forCypress" \
    "wait-on 'http-get://127.0.0.1:3000' && cypress run"
