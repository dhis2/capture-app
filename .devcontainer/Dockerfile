FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2t64 \
    libxtst6 \
    xauth \
    xvfb \
    x11vnc \
    novnc \
    openbox \
    && rm -rf /var/lib/apt/lists/*