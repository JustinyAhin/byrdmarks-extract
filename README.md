# ByrdMarks Extract

ByrdMarks Extract is a specialized tool designed to create backups from 𝕏 (previously Twitter) users' bookmarks.

It serves as a companion to [ByrdMarks](https://byrdmarks.com), an advanced bookmarks management application for 𝕏 that offers semantic search, filtering, and categorization capabilities.

## Privacy & Security

ByrdMarks Extract operates entirely on your local device:

- Authentication state is stored locally on your device
- Bookmark data is saved as local files only
- No data is transmitted to external servers
- Complete control over your data remains with you

## Features

- Automated bookmark extraction from 𝕏 accounts
- Cross-platform compatibility (Linux, macOS, Windows)
- Authenticated access handling
- Reliable data backup creation
- Fully private, local-first architecture

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
- Install pnpm dependencies
- Set up Playwright with Chromium
- Launch a Playwright browser instance at `https://x.com/i/flow/login` to authenticate

Once the browser is launched, please enter your Twitter username and password (and 2FA code if applicable) to authenticate.

## Usage

To extract bookmarks, run:

```bash
bash ./sh/bookmarks.sh
```

The script will verify all dependencies and authentication before proceeding with the extraction.
The extracted bookmarks will be saved in the `.data/bookmarks_backup.json` file.

## Related Projects

- [ByrdMarks](https://byrdmarks.com) - The main application offering advanced bookmark management for 𝕏 with features including:
  - Semantic search
  - Custom filtering
  - Bookmark categorization
  - And more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
