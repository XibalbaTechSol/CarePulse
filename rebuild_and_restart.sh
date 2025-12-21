#!/bin/bash

# Set the database URL environment variable to the new SQLite file in root
export DATABASE_URL="file:carepulse.db"

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

echo "Cleaning previous build..."
rm -rf .next

echo "Building the application..."
DATABASE_URL="file:carepulse.db" npm run build

if [ $? -eq 0 ]; then
  echo "Build successful. Starting server in background for debugging..."
  
  # Start server in background
  DATABASE_URL="file:carepulse.db" npm run start > server.log 2>&1 &
  SERVER_PID=$!
  
  echo "Waiting for server to be ready on port 3000..."
  # Wait loop
  for i in {1..60}; do
    if command -v lsof >/dev/null 2>&1; then
        if lsof -i:3000 -t >/dev/null; then
            echo "Server is up!"
            break
        fi
    else
        # Fallback if lsof not present, try curl or just sleep a bit more and assume
        if curl -s http://localhost:3000 >/dev/null; then
             echo "Server is up!"
             break
        fi
    fi
    echo "Waiting... ($i/60)"
    sleep 2
  done

  # Give it one more second to settle
  sleep 2

  echo "Running debug capture..."
  node tests/debug_startup.js

  echo "---------------------------------------------------"
  echo "Server is running in background (PID: $SERVER_PID)."
  echo "Logs are available in server.log"
  echo "To stop the server, run: kill $SERVER_PID"
  echo "Script finished. Control returned to terminal."
  echo "---------------------------------------------------"
  
  exit 0
else
  echo "Build failed. Fix errors and try again."
  exit 1
fi
