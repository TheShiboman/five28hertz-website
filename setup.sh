#!/bin/bash

# Five28hertz Website Setup Script
echo "🌟 Setting up Five28hertz website environment..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please update to Node.js v16+ and try again."
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Installing dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    echo "# Database connection"
    echo "DATABASE_URL=postgresql://localhost:5432/five28hertz" >> .env
    echo "" >> .env
    echo "# Firebase configuration" >> .env
    echo "VITE_FIREBASE_API_KEY=" >> .env
    echo "VITE_FIREBASE_PROJECT_ID=" >> .env
    echo "VITE_FIREBASE_APP_ID=" >> .env
    echo "" >> .env
    echo "# Google Analytics" >> .env
    echo "VITE_GA_MEASUREMENT_ID=" >> .env
    echo "" >> .env
    echo "⚠️ Please update the .env file with your own values"
fi

# Setup complete
echo "🎉 Setup complete! You can now start the development server with:"
echo "npm run dev"