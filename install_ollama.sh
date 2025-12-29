#!/bin/bash

# Ollama Installation Script for CarePulse AI
# Installs Ollama and downloads required medical AI models

set -e  # Exit on error

echo "================================"
echo "Ollama AI Installation Script"
echo "================================"
echo ""

# Check if already installed
if command -v ollama &> /dev/null; then
    echo "✓ Ollama is already installed!"
    echo "  Version: $(ollama --version 2>&1 | head -1)"
else
    echo "Installing Ollama..."
    echo "This requires sudo privileges and will install to /usr/local"
    echo ""
    
    # Download and run official install script
    curl -fsSL https://ollama.com/install.sh | sh
    
    if [ $? -eq 0 ]; then
        echo "✓ Ollama installed successfully!"
    else
        echo "✗ Ollama installation failed"
        exit 1
    fi
fi

echo ""
echo "================================"
echo "Downloading Medical AI Models"
echo "================================"
echo ""

# Start Ollama service if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "Starting Ollama service..."
    ollama serve > /dev/null 2>&1 &
    sleep 3
fi

# Download Phi-3 Mini (Primary model - 4GB)
echo "Downloading Phi-3 Mini (4GB)..."
echo "This may take 5-10 minutes depending on your connection..."
ollama pull phi3:mini

if [ $? -eq 0 ]; then
    echo "✓ Phi-3 Mini downloaded successfully!"
else
    echo "✗ Failed to download Phi-3 Mini"
    exit 1
fi

# Download Llama 3.2 3B (Alternative - 3GB)
echo ""
echo "Downloading Llama 3.2 3B (3GB)..."
ollama pull llama3.2:3b

if [ $? -eq 0 ]; then
    echo "✓ Llama 3.2 3B downloaded successfully!"
else
    echo "⚠ Failed to download Llama 3.2 (optional model)"
fi

echo ""
echo "================================"
echo "Verifying Installation"
echo "================================"
echo ""

# Test Ollama
echo "Testing Ollama with a simple prompt..."
ollama run phi3:mini "Summarize in one sentence: Patient presents with fever and cough." --verbose

echo ""
echo "================================"
echo "✓ Installation Complete!"
echo "================================"
echo ""
echo "Available models:"
ollama list
echo ""
echo "Ollama is ready for CarePulse AI integration!"
echo ""
echo "Next steps:"
echo "1. Start your dev server: npm run dev"
echo "2. Test the /api/ai/summarize endpoint"
echo "3. Check logs: journalctl -u ollama -f"
