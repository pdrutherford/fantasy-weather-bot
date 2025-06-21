const { getWeeklyForecast } = require("./src/services/weatherService");
const { config } = require("./src/config/config");
const { logger } = require("./src/utils/logger");

async function testWeeklyForecast() {
  try {
    console.log("🧪 Testing Weekly Weather Forecast Generation...\n");

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
        `☀️ Day: ${dayWeather.day.condition}\n` +
        `🌙 Night: ${dayWeather.night.condition}\n\n`;
    });

    // Add footer
    forecastMessage += "*Weather forecast generated for campaign use*";
    console.log("Generated Weekly Forecast Message:");
    console.log("=".repeat(50));
    console.log(forecastMessage);
    console.log("=".repeat(50));

    // Check webhook configuration
    if (config.GM_WEBHOOK_URL) {
      console.log("\n✅ GM_WEBHOOK_URL is configured");
      console.log("To send this forecast, run: npm run weekly");
    } else {
      console.log("\n⚠️  GM_WEBHOOK_URL is not configured");
      console.log(
        "Set the GM_WEBHOOK_URL environment variable to enable weekly forecasts"
      );
    }

    console.log("\n🧪 Test completed successfully!");
  } catch (error) {
    logger.error(`Test failed: ${error.message}`);
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testWeeklyForecast();
