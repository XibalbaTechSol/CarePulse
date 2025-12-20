#!/bin/bash

# Set the database URL environment variable as defined in package.json
export DATABASE_URL="file:/home/xibalbasolutions/NextivaClone/prisma/dev.db"

echo "Stopping any process on port 3000..."

if command -v lsof >/dev/null 2>&1; then
    PID=$(lsof -t -i:3000)
    if [ -n "$PID" ]; then
        kill -9 $PID
        echo "Process $PID killed."
    else
        echo "No process running on port 3000."
    fi
elif command -v fuser >/dev/null 2>&1; then
    fuser -k 3000/tcp
    echo "Process on port 3000 killed (if any)."
else
    echo "Warning: neither lsof nor fuser found. Trying pkill..."
    pkill -f "next start" || true
    pkill -f "next dev" || true
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Building the application..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful. Starting server..."
  npm run start
else
  echo "Build failed. Fix errors and try again."
  exit 1
fi
