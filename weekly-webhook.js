const axios = require("axios");
const {
  getWeeklyForecast,
  getWeatherEmoji,
} = require("./src/services/weatherService");
const { config } = require("./src/config/config");
const { logger } = require("./src/utils/logger");

async function sendWeeklyForecastWebhook() {
  try {
    // Check if GM webhook URL is configured
    if (!config.GM_WEBHOOK_URL) {
      logger.error(
        "GM_WEBHOOK_URL not configured. Weekly forecast cannot be sent."
      );
      console.error(
        "❌ GM_WEBHOOK_URL not configured. Weekly forecast cannot be sent."
      );
      process.exit(1);
    }

    // Get weekly forecast data
    const weeklyForecast = getWeeklyForecast();

    // Create a formatted message for the weekly forecast
    let forecastMessage = "📅 **Weekly Weather Forecast**\n\n";
    weeklyForecast.forEach((dayWeather, index) => {
      const isToday = index === 0;
      const dayLabel = isToday ? "Today" : dayWeather.dayOfWeek;
      forecastMessage +=
        `**${dayLabel} - ${dayWeather.date}**\n` +
        `Season: ${
          dayWeather.season.charAt(0).toUpperCase() + dayWeather.season.slice(1)
        }\n` +
        `${getWeatherEmoji(dayWeather.day.condition, false)} Day: ${
          dayWeather.day.condition
        }\n` +
        `${getWeatherEmoji(dayWeather.night.condition, true)} Night: ${
          dayWeather.night.condition
        }\n\n`;
    });

    // Add footer
    forecastMessage += "*Weather forecast generated for campaign use*";

    // Format the message for Discord webhook
    const webhookMessage = {
      content: forecastMessage,
    };

    // Send to GM Discord webhook
    const response = await axios.post(config.GM_WEBHOOK_URL, webhookMessage, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      logger.info("Weekly weather forecast posted successfully to GM channel");
      console.log(
        "✅ Weekly weather forecast posted successfully to GM channel!"
      );
    } else {
      logger.warn(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    logger.error(`Failed to send weekly forecast webhook: ${error.message}`);
    console.error("❌ Failed to send weekly forecast:", error.message);
    process.exit(1);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  sendWeeklyForecastWebhook();
}

module.exports = { sendWeeklyForecastWebhook };
