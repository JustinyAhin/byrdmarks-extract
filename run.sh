#!/bin/bash

# Check if Node.js is installed, install if not present
if ! command -v node &>/dev/null; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if pnpm is installed, install if not present
if ! command -v pnpm &>/dev/null; then
    echo "pnpm not found. Installing..."
    npm install -g pnpm
fi

# Install Playwright Chromium browser
echo "Installing Playwright Chromium..."
npx playwright install chromium

# Run the specified test file
echo "Running tests..."
npx playwright test bookmarks.spec.ts
