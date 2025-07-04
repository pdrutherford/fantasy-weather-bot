# GitHub Copilot Instructions for Discord Weather Webhook

## Project Overview

Webhook service that posts daily weather updates for fictional campaigns to Discord. Runs on GitHub Actions with deterministic weather generation.

## Code Style

- Use CommonJS (`require`/`module.exports`)
- Prefer async/await
- Add error handling to all async operations
- Use the custom logger for all output

## Project Structure

- **Main Entry**: [`webhook.js`](../webhook.js) - daily weather webhook execution
- **Weekly Entry**: [`weekly-webhook.js`](../weekly-webhook.js) - weekly forecast webhook execution
- **Config**: [`src/config/config.js`](../src/config/config.js) - environment variables
- **Weather Service**: [`src/services/weatherService.js`](../src/services/weatherService.js) - weather generation logic
- **Logger**: [`src/utils/logger.js`](../src/utils/logger.js) - structured logging

## Environment Variables

**Configuration:**

- `REGIONS_CONFIG`: Complete regions.json as JSON string (GitHub Actions only)
- `WEEKLY_FORECAST_WEBHOOK_URL`: Consolidated weekly forecasts (optional)

**Local Development:**

- Create `regions.json` in project root with webhook URLs
- File paths checked in order: `regions.json`, `config/regions.json`, `src/config/custom-regions.json`, `src/config/regions.json`, `src/config/regions-example.json`

**Security:** `regions.json` contains sensitive webhook URLs and must not be committed. Use `REGIONS_CONFIG` environment variable for GitHub Actions.

## Common Tasks

### Modifying Weather Data

Edit seasonal conditions in `weatherService.js`:

- Add/remove weather conditions per season
- Adjust seasonal date ranges
- Modify seeded random generation

### Testing Locally

```bash
npm test          # runs test-webhook.js (daily weather)
npm run test-weekly  # runs test-weekly.js (weekly forecast)
```

### Error Handling

- Wrap async operations in try-catch
- Use logger for all output
- Fail gracefully on webhook errors

## Key Features

- **Deterministic**: Same date = same weather
- **Seasonal**: Weather varies by time of year
- **Dual Webhooks**: Daily updates for players, weekly forecasts for GMs
- **Dynamic Emojis**: Weather-appropriate emojis that differ for day/night
- **Modular**: Easy to extend with new features
