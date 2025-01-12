#!/bin/bash

# Check if a command exists
check_command() {
    if ! command -v "$1" &>/dev/null; then
        return 1
    fi
    return 0
}

# Get Playwright path based on OS
get_playwright_path() {
    local OS=$(uname -s)
    case "$OS" in
    Linux*) echo "$HOME/.cache/ms-playwright" ;;
    Darwin*) echo "$HOME/Library/Caches/ms-playwright" ;;
    MINGW* | CYGWIN* | MSYS*) echo "$USERPROFILE/AppData/Local/ms-playwright" ;;
    *)
        echo ""
        return 1
        ;;
    esac
    return 0
}

# Check if all required setup is complete
check_setup() {
    local missing_deps=()

    if ! check_command "node"; then
        missing_deps+=("Node.js")
    fi

    if ! check_command "pnpm"; then
        missing_deps+=("pnpm")
    fi

    local playwright_path=$(get_playwright_path)
    if [ -z "$playwright_path" ] || [ ! -d "$playwright_path" ]; then
        missing_deps+=("Playwright browsers")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo "Missing dependencies: ${missing_deps[*]}"
        echo "Please run: bash ./sh/setup.sh"
        return 1
    fi

    return 0
}

# Check if auth file exists
check_auth() {
    local auth_file="$1"
    if [ ! -f "$auth_file" ]; then
        echo "Authentication file not found: $auth_file"
        return 1
    fi
    return 0
}

# Install missing dependency
install_dependency() {
    local dep="$1"
    case "$dep" in
    "node")
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ;;
    "pnpm")
        echo "Installing pnpm..."
        npm install -g pnpm
        ;;
    "playwright")
        echo "Installing Playwright Chromium..."
        npx playwright install chromium
        ;;
    *)
        echo "Unknown dependency: $dep"
        return 1
        ;;
    esac
    return 0
}
