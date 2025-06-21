const axios = require("axios");
const {
  getWeatherUpdate,
  getWeatherEmoji,
} = require("./src/services/weatherService");
const { config } = require("./src/config/config");
const { logger } = require("./src/utils/logger");

async function sendWeatherWebhook() {
  try {
    // Get weather data
    const weather = getWeatherUpdate();

    // Format the message for Discord webhook
    const weatherMessage = {
      content:
        `📅 **Weather Update**\n` +
        `**Date:** ${weather.date}\n` +
        `**Season:** ${
          weather.season.charAt(0).toUpperCase() + weather.season.slice(1)
        }\n` +
        `${getWeatherEmoji(weather.day.condition, false)} **Day:** ${
          weather.day.condition
        }\n` +
        `${getWeatherEmoji(weather.night.condition, true)} **Night:** ${
          weather.night.condition
        }`,
    };

    // Send to Discord webhook
    const response = await axios.post(config.WEBHOOK_URL, weatherMessage, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      logger.info("Weather update posted successfully via webhook");
      console.log("✅ Weather update posted successfully!");
    } else {
      logger.warn(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    logger.error(`Failed to send weather webhook: ${error.message}`);
    console.error("❌ Failed to send weather update:", error.message);
    process.exit(1);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  sendWeatherWebhook();
}

module.exports = { sendWeatherWebhook };
