# Migration from Discord Bot to Webhook

This document explains how to migrate from the Discord bot implementation to the webhook-based GitHub Actions approach.

## Why Migrate?

### Benefits of Webhook Approach:

- **No server hosting required** - Runs on GitHub's infrastructure
- **Zero cost** - GitHub Actions provides free tier for public repositories
- **Better reliability** - No need to maintain a constantly running bot
- **Easier deployment** - Just push to GitHub, no server setup
- **Built-in scheduling** - GitHub Actions handles the cron scheduling

### Drawbacks:

- **No interactive commands** - Can't respond to user interactions
- **Fixed schedule only** - No manual triggering from Discord
- **Limited customization** - Less flexibility than a full bot

## Migration Steps

### 1. Create Discord Webhook

Instead of a bot token, you'll need a webhook URL:

1. Go to your Discord channel → Settings → Integrations → Webhooks
2. Create a new webhook
3. Copy the webhook URL (format: `https://discord.com/api/webhooks/ID/TOKEN`)

### 2. Update Environment Variables

**Old (Bot):**

```
BOT_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
WEATHER_CHANNEL_ID=your_channel_id
```

**New (Webhook):**

```
WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### 3. Set up GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add new secret: `WEBHOOK_URL` with your webhook URL

### 4. Test the Migration

```bash
# Install new dependencies
npm install

# Test locally (optional)
npm test

# Push to GitHub to trigger the workflow
git add .
git commit -m "Migrate to webhook approach"
git push
```

### 5. Clean Up Old Bot

- Disable the old bot in Discord Developer Portal
- Remove the bot from your server (optional)
- Delete old bot tokens from your environment

## Reverting Back to Bot

If you need to revert to the bot approach:

1. Checkout the previous commit with bot code
2. Restore the old dependencies in package.json
3. Set up bot environment variables again
4. Deploy to your hosting service

## Features No Longer Available

- `/weather` slash command - users can't trigger weather manually
- Interactive responses to user commands
- Real-time bot status and presence
- Custom bot permissions and role management

## New Features Available

- Automatic daily posting without server maintenance
- Easy schedule modification via GitHub Actions
- Built-in logging via GitHub Actions logs
- Version control for all weather posts (git history)

## Troubleshooting

### Webhook not posting

- Check GitHub Actions logs in the Actions tab
- Verify webhook URL is correct in GitHub secrets
- Ensure webhook has permission to post in the channel

### Wrong schedule

- Edit `.github/workflows/daily-weather.yml`
- Modify the cron expression
- Push changes to update the schedule

### Want to test manually

- Go to Actions tab → Daily Weather Update → Run workflow
