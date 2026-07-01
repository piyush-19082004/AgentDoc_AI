#!/bin/bash
# Quick setup script for Autonomous AI Agent

set -e

echo "🚀 Autonomous AI Agent - Setup Script"
echo "======================================"

# Check Python version
echo "✓ Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "  Python $python_version"

# Create virtual environment
echo "✓ Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "  Virtual environment created"
else
    echo "  Virtual environment already exists"
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "✓ Installing dependencies..."
pip install --upgrade pip > /dev/null
pip install -r requirements.txt > /dev/null
echo "  Dependencies installed"

# Create .env if it doesn't exist
echo "✓ Checking .env configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  Created .env from template"
    echo "  ⚠️  IMPORTANT: Edit .env and add your GEMINI_API_KEY"
else
    echo "  .env already exists"
fi

# Check if GEMINI_API_KEY is set
if grep -q "your_gemini_api_key_here" .env; then
    echo "  ⚠️  WARNING: GEMINI_API_KEY not configured!"
    echo "  Please edit .env and add your API key from https://aistudio.google.com"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your GEMINI_API_KEY"
echo "2. Run: python -m app.main"
echo "3. Test: curl http://localhost:8000/health"
echo ""
echo "For detailed setup: cat README.md"
echo "For quick start: cat QUICKSTART.md"
echo ""
