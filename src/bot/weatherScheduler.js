const cron = require("node-cron");
const { getWeatherUpdate } = require("../services/weatherService");
const { config } = require("../config/config");
const { logger } = require("../utils/logger");
const { Client, GatewayIntentBits } = require("discord.js");

// Eastern Time zone offset (handles DST by using America/New_York)
const TIMEZONE = "America/New_York";

function startWeatherScheduler(client) {
  // Schedule: At 00:00 (midnight) every day, Eastern Time
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        const channel = await client.channels.fetch(config.WEATHER_CHANNEL_ID);
        if (!channel) {
          logger.error("Weather channel not found.");
          return;
        }
        const weather = getWeatherUpdate();
        const weatherMessage =
          `🌤️ **Weather Update**\n` +
          `**Date:** ${weather.date}\n` +
          `**Day:** ${weather.day.condition}\n` +
          `**Night:** ${weather.night.condition}`;
        await channel.send(weatherMessage);
        logger.info("Posted scheduled weather update.");
      } catch (error) {
        logger.error("Scheduled weather update failed: " + error);
      }
    },
    {
      timezone: TIMEZONE,
    }
  );
  logger.info("Weather scheduler started (daily at midnight ET).");
}

module.exports = { startWeatherScheduler };
