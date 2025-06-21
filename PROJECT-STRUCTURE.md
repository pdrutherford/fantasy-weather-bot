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
├── webhook.js                    # Daily weather webhook entry point
├── weekly-webhook.js             # Weekly forecast webhook entry point
├── test-webhook.js               # Local testing script for daily weather
├── test-weekly.js                # Local testing script for weekly forecast
├── .github/
│   └── workflows/
│       ├── daily-weather.yml     # Daily weather GitHub Actions workflow
│       └── weekly-forecast.yml   # Weekly forecast GitHub Actions workflow
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

- **`webhook.js`** - Daily weather update entry point that sends weather to Discord
- **`weekly-webhook.js`** - Weekly forecast entry point that sends 7-day forecast to GM channel
- **`src/services/weatherService.js`** - Contains weather generation logic with daily and weekly functions
- **`src/config/config.js`** - Configuration for both daily and GM webhook URLs

### Development Files

- **`test-webhook.js`** - Script for testing daily weather updates locally
- **`test-weekly.js`** - Script for testing weekly forecasts locally
- **`.github/workflows/daily-weather.yml`** - Automated daily execution at 12:00 PM UTC
- **`.github/workflows/weekly-forecast.yml`** - Automated weekly execution every Saturday at midnight UTC

### Dependencies

- **`axios`** - For HTTP requests to Discord webhook
- **`dotenv`** - For environment variable management

## Usage

```bash
# Local testing
npm test          # Test daily weather update
npm run test-weekly  # Test weekly forecast

# Manual execution
npm start         # Send daily weather update
npm run weekly    # Send weekly forecast
```

The GitHub Actions workflows automatically run:

- **Daily weather**: Every day at 12:00 PM UTC (8:00 AM EST)
- **Weekly forecast**: Every Saturday at midnight UTC
