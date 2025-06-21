# Discord Weather Webhook

A GitHub Actions-powered webhook service that posts daily weather updates for your campaign to Discord.

## Features

- Scheduled daily weather reports via Discord webhooks
- Weekly weather forecasts for GMs via separate webhook
- Runs on GitHub Actions (no server hosting required)
- Deterministic weather generation based on date
- Dynamic weather-appropriate emojis that differ for day/night conditions
- Modular service structure for easy extension

## Setup

### 1. Create Discord Webhooks

1. Go to your Discord channel settings
2. Navigate to **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Copy the webhook URL
5. **Optional**: Create a second webhook for GM-only weekly forecasts in a separate channel

### 2. Configure GitHub Repository

1. **Fork or clone this repository**
2. **Add the webhook URLs as GitHub secrets:**
   - Go to your repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Required: `WEBHOOK_URL` (for daily weather updates)
   - Optional: `GM_WEBHOOK_URL` (for weekly forecasts to GM channel)

### 3. Schedule Configuration

**Daily Weather Updates:** Run daily at 12:00 PM UTC (8:00 AM EST/7:00 AM EDT)
**Weekly Forecasts:** Run Saturdays at 00:00 UTC (midnight)

To change the schedule, edit the cron expressions in `.github/workflows/` files.

### 4. Test the Setup

- Go to the **Actions** tab in your GitHub repository
- Find the "Daily Weather Update" or "Weekly Weather Forecast" workflow
- Click **Run workflow** to test manually

## Local Development

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your webhook URL
3. **Test locally**

   ```sh
   # Test daily weather update
   npm test

   # Test weekly forecast
   npm run test-weekly

   # Send daily weather update
   npm start

   # Send weekly forecast
   npm run weekly
   ```

## Project Structure

- `webhook.js` - Daily weather webhook sender
- `weekly-webhook.js` - Weekly forecast webhook sender
- `test-webhook.js` - Test daily weather locally
- `test-weekly.js` - Test weekly forecast locally
- `src/services/` - Business logic (weather generation)
- `src/config/` - Configuration loader
- `src/utils/` - Logger utilities
- `.github/workflows/` - GitHub Actions workflows

## Weather System

- Deterministic weather based on current date
- Seasonal variations (spring, summer, autumn, winter)
- Different day/night conditions with appropriate emojis
- Western European climate patterns
- Weekly forecasts for campaign planning

## License

MIT
