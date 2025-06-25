# Discord Weather Webhook for Cataphracts Campaigns

Automated daily weather updates for real-time [Cataphracts](https://samsorensen.blot.im/cataphracts-design-diary-1) campaigns. Posts consistent, date-based weather to Discord channels via GitHub Actions.

## Features

- Daily weather reports synchronized with real-world dates
- Optional weekly forecasts for operational planning
- Fully configurable weather patterns and conditions
- Seasonal weather variations with customizable date ranges
- Deterministic weather generation (same date = same weather)
- No server hosting required (runs on GitHub Actions)
- Modular design for easy customization

## Setup

### 1. Create Discord Webhooks

1. Go to your Discord channel settings
2. Navigate to **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Copy the webhook URL
5. **Optional**: Create a second webhook for weekly forecasts in a separate channel

### 2. Configure GitHub Repository

1. **Fork this repository**
2. **Add webhook URLs as GitHub secrets:**
   - Go to repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Required: `WEBHOOK_URL` (daily weather updates)
   - Optional: `GM_WEBHOOK_URL` (weekly forecasts)

### 3. Test the Setup

- Go to the **Actions** tab in your repository
- Find "Daily Weather Update" workflow
- Click **Run workflow** to test

## Configuration

### Schedule Timing

Edit `.github/workflows/daily-weather.yml` and `.github/workflows/weekly-forecast.yml` to change when updates are posted.

Default schedule:

- **Daily weather**: 5:00 AM UTC (midnight Eastern)
- **Weekly forecast**: Saturday 00:00 UTC

Change the cron expression to modify timing:

```yaml
schedule:
  - cron: "0 12 * * *" # Daily at noon UTC, as an example
```

### Weather Patterns

Weather conditions are defined in `src/services/weatherService.js`. The system includes four seasons with customizable conditions for each. Weather emojis in the message are generated to try to match the descriptive text.

#### Modifying Weather Conditions

Edit the `seasonalWeather` object to change available weather:

```javascript
const seasonalWeather = {
  spring: {
    dayConditions: [
      "Clear skies",
      "Light rain",
      "Overcast",
      // Add your conditions here
    ],
    nightConditions: [
      "Clear and cool",
      "Light drizzle",
      "Cloudy",
      // Add your conditions here
    ],
  },
  // ... other seasons
};
```

#### Changing Seasonal Date Ranges

Modify the `getSeason` function to adjust when seasons change:

```javascript
const getSeason = (date) => {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) return "spring"; // Mar-May
  if (month >= 6 && month <= 8) return "summer"; // Jun-Aug
  if (month >= 9 && month <= 11) return "autumn"; // Sep-Nov
  return "winter"; // Dec-Feb
};
```

#### Weather Emoji Customization

Edit the `getWeatherEmoji` function to change emoji mappings:

```javascript
// Snow and ice conditions
if (conditionLower.includes("snow")) {
  return "❄️";
}
// Add or modify emoji mappings
```

### Message Format

Customize weather post format by editing `webhook.js` and `weekly-webhook.js`:

**Daily format** (`webhook.js`):

```javascript
const weatherMessage = {
  content:
    `📅 **Weather Update**\n` +
    `**Date:** ${weather.date}\n` +
    `**Season:** ${weather.season}\n` +
    `☀️ **Day:** ${weather.day.condition}\n` +
    `🌙 **Night:** ${weather.night.condition}`,
};
```

**Weekly format** (`weekly-webhook.js`):

```javascript
let forecastMessage = "📅 **Weekly Weather Forecast**\n\n";
// Modify loop to change weekly format
```

## Local Development

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your webhook URLs
3. **Test locally**
   ```sh
   npm test          # Test daily weather
   npm run test-weekly  # Test weekly forecast
   npm start         # Send daily update
   npm run weekly    # Send weekly forecast
   ```

## Advanced Configuration

### Climate Patterns

The default weather system uses Western European climate patterns. To modify:

1. **Edit seasonal conditions** in `src/services/weatherService.js`
2. **Adjust probability weights** by reordering conditions (first conditions are more likely)
3. **Add new seasons** by modifying the `seasonalWeather` object and `getSeason` function

### Deterministic Weather System

Weather is generated using a seeded random number generator based on the date. This ensures:

- Same date always produces same weather
- Weather patterns remain consistent across campaign restarts
- Players can reference historical weather

To modify the randomization:

```javascript
// In weatherService.js
function dateToSeed(date) {
  // Modify this function to change how dates map to weather
}
```

### Multiple Climate Zones

To support different regions with different weather:

1. **Create separate weather condition arrays** for each region
2. **Add region parameter** to weather generation functions
3. **Set up multiple webhooks** for different channels
4. **Configure separate workflows** for each region

### Custom Weather Events

Add special weather events by modifying the weather generation logic:

```javascript
// Example: Add rare storm events
if (rng() < 0.05) {
  // 5% chance
  return "Severe thunderstorm";
}
```

## Project Structure

```
├── webhook.js                    # Daily weather sender
├── weekly-webhook.js             # Weekly forecast sender
├── test-webhook.js               # Local daily testing
├── test-weekly.js                # Local weekly testing
├── src/
│   ├── config/config.js          # Environment variables
│   ├── services/weatherService.js # Weather generation logic
│   └── utils/logger.js           # Logging utilities
├── .github/workflows/
│   ├── daily-weather.yml         # Daily automation
│   └── weekly-forecast.yml       # Weekly automation
└── .env.example                  # Environment template
```

## Weather System Details

- **Deterministic**: Weather is calculated from date, not random
- **Seasonal**: Four seasons with customizable date ranges
- **Day/Night**: Separate conditions for day and night periods
- **Configurable**: All weather conditions and patterns can be modified
- **Emoji Support**: Weather-appropriate emojis with day/night variations

## Troubleshooting

### Common Issues

**Webhook not posting**: Verify webhook URL is correct and channel permissions allow posting

**Wrong timing**: Check cron expressions in workflow files and timezone calculations

**Weather not changing**: Confirm date-based generation is working by testing different dates locally

**Missing dependencies**: Run `npm install` if testing locally

### Testing Changes

Before deploying weather pattern changes:

1. **Test locally** with `npm test`
2. **Verify different dates** produce expected weather variations
3. **Check emoji rendering** in Discord
4. **Validate message formatting**

## License

MIT
