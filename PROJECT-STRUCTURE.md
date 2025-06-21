# Project Structure

This document shows the cleaned-up project structure after converting from Discord bot to webhook.

## Current Structure

```
discord-weather-bot/
├── .env                          # Environment variables (local only)
├── .env.example                  # Example environment file
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lock file
├── README.md                     # Project documentation
├── MIGRATION.md                  # Migration guide from bot to webhook
├── webhook.js                    # Main webhook entry point
├── test-webhook.js               # Local testing script
├── .github/
│   └── workflows/
│       └── daily-weather.yml     # GitHub Actions workflow
└── src/
    ├── config/
    │   └── config.js              # Configuration management
    ├── services/
    │   └── weatherService.js      # Weather generation logic
    └── utils/
        └── logger.js              # Logging utilities
```

## Removed Files/Directories

The following bot-related files were removed during cleanup:

- `src/index.js` - Old bot entry point
- `src/bot/` - Entire bot directory including:
  - `src/bot/client.js`
  - `src/bot/loadCommands.js`
  - `src/bot/weatherScheduler.js`
  - `src/bot/events/`
- `src/commands/` - Interactive commands directory
- `docs/` - Empty documentation directory
- `scripts/` - Empty scripts directory
- `logs/` - Bot logs directory

## Key Files

### Core Files
- **`webhook.js`** - Main entry point that sends weather updates to Discord
- **`src/services/weatherService.js`** - Contains weather generation logic
- **`src/config/config.js`** - Simplified configuration (only webhook URL needed)

### Development Files
- **`test-webhook.js`** - Script for local testing
- **`.github/workflows/daily-weather.yml`** - Automated daily execution

### Dependencies
- **`axios`** - For HTTP requests to Discord webhook
- **`dotenv`** - For environment variable management

## Usage

```bash
# Local testing
npm test

# Manual execution
npm start
```

The GitHub Actions workflow automatically runs daily at 12:00 PM UTC (8:00 AM EST).
