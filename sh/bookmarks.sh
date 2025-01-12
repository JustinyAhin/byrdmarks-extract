#!/bin/bash

source ./sh/utils.sh

# Check all dependencies
if ! check_setup; then
    exit 1
fi

# Check authentication
if ! check_auth ".data/auth/twitter.json"; then
    exit 1
fi

echo "Running bookmarks script..."
npx playwright test bookmarks.spec.ts
