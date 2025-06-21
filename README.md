# Discord Weather Bot

A Discord bot that posts daily weather updates for your campaign, scheduled to post at midnight Eastern Time.

## Features
- Scheduled daily weather report in a specified channel
- Modular command and service structure
- Easy to extend for new features

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your Discord bot credentials and channel ID.
4. **Run the bot**
   ```sh
   node src/index.js
   ```

## Project Structure
- `src/commands/` - Slash commands
- `src/services/` - Business logic (e.g., weather generation)
- `src/bot/` - Bot client, events, and scheduler
- `src/config/` - Configuration loader
- `src/utils/` - Logger and utilities

## Development
- Commands are auto-loaded from `src/commands/`
- Scheduler posts weather daily at midnight ET
- Use `.env` for secrets (never commit this file)

## License
MIT