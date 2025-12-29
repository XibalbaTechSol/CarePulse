#!/bin/bash

# CarePulse Startup Script (Frontend + AI Backend)
# ------------------------------------------------

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   CarePulse System Startup            ${NC}"
echo -e "${BLUE}=======================================${NC}"

# 1. Environment Configuration
# --------------------------
export DATABASE_URL="file:carepulse.db"
echo -e "${YELLOW}[ENV]${NC} Database set to: ${DATABASE_URL}"

# 2. Check AI Backend (Ollama)
# --------------------------
# echo -e "\n${BLUE}[AI]${NC} Checking AI Service (Ollama)..."
# if command -v ollama >/dev/null 2>&1; then
#     if pgrep -x "ollama" >/dev/null; then
#         echo -e "${GREEN}✓ Ollama is running.${NC}"
#     else
#         echo -e "${YELLOW}⚠ Ollama is not running. Starting service...${NC}"
#         # ollama serve > /dev/null 2>&1 &
#         # Wait for Ollama to spin up
#         # sleep 5
#     fi
    
#     # Check if models are available (optional, non-blocking)
#     if ollama list | grep -q "phi3:mini"; then
#          echo -e "${GREEN}✓ Found 'phi3:mini' model.${NC}"
#     else
#          echo -e "${YELLOW}⚠ Model 'phi3:mini' not found. Run ./install_ollama.sh to install.${NC}"
#     fi
# else
#     echo -e "${RED}✗ Ollama not installed. AI features may be limited.${NC}"
#     echo -e "  Run 'sudo ./install_ollama.sh' to install."
# fi
echo -e "${YELLOW}[Configuration]${NC} AI Service disabled for UI testing (RAM saving)."

# 3. Process Cleanup (Port 3000)
# --------------------------
echo -e "\n${BLUE}[System]${NC} Cleaning up existing processes..."
if command -v lsof >/dev/null 2>&1; then
    PID=$(lsof -t -i:3000)
    if [ -n "$PID" ]; then
        kill -9 $PID
        echo -e "${GREEN}✓ Killed process $PID on port 3000.${NC}"
    fi
else
    pkill -f "next start" || true
    pkill -f "next dev" || true
fi

# 4. Build & Start
# --------------------------
echo -e "\n${BLUE}[Build]${NC} Rebuilding application..."
rm -rf .next
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful.${NC}"
    
    echo -e "\n${BLUE}[Start]${NC} Starting Next.js server..."
    # Start server in background
    npm run start > server.log 2>&1 &
    SERVER_PID=$!
    
    echo "Waiting for server to be ready..."
    # Wait loop
    for i in {1..30}; do
        if curl -s http://localhost:3000 >/dev/null; then
             echo -e "${GREEN}✓ Server is up and responding!${NC}"
             break
        fi
        sleep 2
    done

    echo -e "\n${BLUE}[CarePulse AI]${NC} Starting Medical AI webserver on port 8000..."
    chmod +x toad/src/toad/cli.py  # Ensure executable permission
    cd toad
    PYTHONPATH=src nohup python3 -m toad.cli run --agent medical --serve --port 8000 --host localhost > ../carepulse_ai.log 2>&1 &
    AI_PID=$!
    cd ..
    echo -e "${GREEN}✓ CarePulse Medical AI started (PID: $AI_PID)${NC}"
    
    echo -e "\n${BLUE}=======================================${NC}"
    echo -e "${GREEN} System Ready! ${NC}"
    echo -e "${BLUE}=======================================${NC}"
    echo -e "Frontend:     http://localhost:3000"
    echo -e "CarePulse AI: http://localhost:8000"
    echo -e "Logs:         server.log | carepulse_ai.log"
    echo -e "Process IDs:  Frontend=$SERVER_PID | AI=$AI_PID"
    echo -e "To stop:      kill $SERVER_PID $AI_PID"
    
    # Run verification (optional)
    if [ -f "tests/debug_startup.js" ]; then
        echo -e "\n${YELLOW}[Debug]${NC} Running startup verification..."
        node tests/debug_startup.js
    fi
    
    exit 0
else
    echo -e "${RED}✗ Build failed. Check logs.${NC}"
    exit 1
fi
