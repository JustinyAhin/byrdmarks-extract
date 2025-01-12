#!/bin/bash

source ./sh/utils.sh

# Install all required dependencies
if ! check_command "node"; then
    install_dependency "node"
fi

if ! check_command "pnpm"; then
    install_dependency "pnpm"
fi

if [ ! -d "$(get_playwright_path)" ]; then
    install_dependency "playwright"
fi

echo "Running tests..."
npx playwright test auth.spec.ts
