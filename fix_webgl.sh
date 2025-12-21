#!/bin/bash

# This script launches Google Chrome with flags to force-enable WebGL
# and ignore GPU blocklists. This is useful for Linux environments
# or older hardware where WebGL might be disabled by default.

echo "🚀 Launching Chrome with WebGL force-enabled..."

# Detect Chrome binary
if command -v google-chrome &> /dev/null; then
    CHROME_BIN="google-chrome"
elif command -v google-chrome-stable &> /dev/null; then
    CHROME_BIN="google-chrome-stable"
elif command -v chromium-browser &> /dev/null; then
    CHROME_BIN="chromium-browser"
elif command -v chromium &> /dev/null; then
    CHROME_BIN="chromium"
else
    echo "❌ Chrome or Chromium not found in PATH."
    exit 1
fi

$CHROME_BIN \
    --enable-gpu \
    --ignore-gpu-blocklist \
    --enable-webgl \
    --enable-webgl2 \
    --enable-accelerated-2d-canvas \
    --enable-gpu-rasterization \
    --enable-unsafe-webgpu \
    --enable-native-gpu-memory-buffers \
    --override-software-rendering-list \
    --use-gl=desktop \
    "$@" &

echo "✅ Chrome launched. Please visit 'chrome://gpu' to verify WebGL status."
echo "💡 If WebGL is still disabled, ensure 'Hardware Acceleration' is ON in Chrome Settings."
