# Byrdmarks Extract

Byrdmarks Extract is a specialized tool designed to create backups from 𝕏 (previously Twitter) users' bookmarks.

It serves as a companion to [Byrdmarks](https://byrdmarks.com), an advanced bookmarks management application for 𝕏 that offers semantic search, filtering, and categorization capabilities.

## Features

- Automated bookmark extraction from 𝕏 accounts
- Cross-platform compatibility (Linux, macOS, Windows)
- Authenticated access handling
- Reliable data backup creation

## Prerequisites

- Node.js
- pnpm
- Playwright (Chromium)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JustinyAhin/byrdmarks-extract.git
cd byrdmarks-extract
```

2. Run the setup script:

```bash
bash ./sh/setup.sh
```

This will automatically:

- Install Node.js if not present
- Install pnpm if not present
- Set up Playwright with Chromium

## Usage

To extract bookmarks, run:

```bash
bash ./sh/bookmarks.sh
```

The script will verify all dependencies and authentication before proceeding with the extraction.
The extracted bookmarks will be saved in the `.data/bookmarks_backup.json` file.

## Related Projects

- [Byrdmarks](https://byrdmarks.com) - The main application offering advanced bookmark management for 𝕏 with features including:
  - Semantic search
  - Custom filtering
  - Bookmark categorization
  - And more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
