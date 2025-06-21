# Discord Weather Webhook

A GitHub Actions-powered webhook service that posts daily weather updates for your campaign to Discord.

## Features

- Scheduled daily weather reports via Discord webhooks
- Runs on GitHub Actions (no server hosting required)
- Deterministic weather generation based on date
- Modular service structure for easy extension

## Setup

### 1. Create a Discord Webhook

1. Go to your Discord channel settings
2. Navigate to **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Copy the webhook URL

### 2. Configure GitHub Repository

1. **Fork or clone this repository**
2. **Add the webhook URL as a GitHub secret:**
   - Go to your repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `WEBHOOK_URL`
   - Value: Your Discord webhook URL

### 3. Schedule Configuration

The workflow runs daily at 12:00 PM UTC (8:00 AM EST/7:00 AM EDT).
To change the schedule, edit `.github/workflows/daily-weather.yml` and modify the cron expression.

### 4. Test the Setup

- Go to the **Actions** tab in your GitHub repository
- Find the "Daily Weather Update" workflow
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
   npm start
   ```

## Project Structure

- `src/webhook.js` - Main webhook sender
- `src/services/` - Business logic (weather generation)
- `src/config/` - Configuration loader
- `src/utils/` - Logger utilities
- `.github/workflows/` - GitHub Actions workflow

## Weather System

- Deterministic weather based on current date
- Seasonal variations (spring, summer, autumn, winter)
- Different day/night conditions
- Western European climate patterns

## License

MIT
