require("dotenv").config();

const config = {
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  // Legacy config kept for backwards compatibility
  BOT_TOKEN: process.env.BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  WEATHER_CHANNEL_ID: process.env.WEATHER_CHANNEL_ID,
};

// Validate required environment variables
const requiredVars = ["WEBHOOK_URL"];
for (const varName of requiredVars) {
  if (!config[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

module.exports = { config };
