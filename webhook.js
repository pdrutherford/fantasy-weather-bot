const axios = require("axios");
const {
  getRegionalWeatherUpdate,
  getWeatherEmoji,
} = require("./src/services/weatherService");
const {
  getConfiguredRegions,
  getRegionConfig,
} = require("./src/config/config");
const { logger } = require("./src/utils/logger");

async function sendRegionalWeatherWebhook(regionId) {
  try {
    // Get region configuration
    const regionConfig = getRegionConfig(regionId);
    logger.info(`Sending weather update for region: ${regionConfig.name}`);

    // Get weather data for this region
    const weather = getRegionalWeatherUpdate(regionConfig);

    // Build the weather message content
    let messageContent =
      `📅 **Weather Update${
        regionConfig.name ? ` - ${regionConfig.name}` : ""
      }**\n` +
      `**Date:** ${weather.date}\n` +
      `**Season:** ${
        weather.season.charAt(0).toUpperCase() + weather.season.slice(1)
      }\n` +
      `${getWeatherEmoji(weather.day.condition, false)} **Day:** ${
        weather.day.condition
      }\n`;

    // Add mechanical impact for day weather if it exists
    if (weather.day.mechanicalImpact) {
      messageContent += `⚠️ **Day Effect:** *${weather.day.mechanicalImpact}*\n`;
    }

    messageContent += `${getWeatherEmoji(
      weather.night.condition,
      true
    )} **Night:** ${weather.night.condition}\n`;

    // Add mechanical impact for night weather if it exists
    if (weather.night.mechanicalImpact) {
      messageContent += `⚠️ **Night Effect:** *${weather.night.mechanicalImpact}*\n`;
    }

    // Format the message for Discord webhook
    const weatherMessage = {
      content: messageContent,
    };

    // Send to Discord webhook
    const response = await axios.post(regionConfig.webhookUrl, weatherMessage, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      logger.info(
        `Weather update posted successfully for region: ${regionConfig.name}`
      );
      console.log(
        `✅ Weather update posted successfully for ${regionConfig.name}!`
      );
    } else {
      logger.warn(
        `Unexpected response status: ${response.status} for region: ${regionConfig.name}`
      );
    }
  } catch (error) {
    logger.error(
      `Failed to send weather webhook for region ${regionId}: ${error.message}`
    );
    console.error(
      `❌ Failed to send weather update for ${regionId}:`,
      error.message
    );
    throw error; // Re-throw to allow caller to handle
  }
}

async function sendAllRegionalWebhooks() {
  try {
    const configuredRegions = getConfiguredRegions();

    if (configuredRegions.length === 0) {
      logger.warn("No regions configured with webhook URLs");
      console.log("⚠️ No regions configured with webhook URLs");
      return;
    }

    logger.info(
      `Sending weather updates for ${configuredRegions.length} regions`
    );

    const results = [];
    for (const region of configuredRegions) {
      try {
        await sendRegionalWeatherWebhook(region.id);
        results.push({ regionId: region.id, success: true });
      } catch (error) {
        results.push({
          regionId: region.id,
          success: false,
          error: error.message,
        });
      }
    }

    // Log summary
    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    if (failed === 0) {
      logger.info(
        `All ${successful} regional weather updates sent successfully`
      );
      console.log(
        `✅ All ${successful} regional weather updates sent successfully!`
      );
    } else {
      logger.warn(
        `${successful} successful, ${failed} failed regional weather updates`
      );
      console.log(
        `⚠️ ${successful} successful, ${failed} failed regional weather updates`
      );

      // Log failures
      results
        .filter((r) => !r.success)
        .forEach((result) => {
          logger.error(`Failed region ${result.regionId}: ${result.error}`);
        });
    }

    // Exit with error code if any failed
    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Failed to send regional webhooks: ${error.message}`);
    console.error("❌ Failed to send regional webhooks:", error.message);
    process.exit(1);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  // Check if a specific region was provided as argument
  const regionId = process.argv[2];

  if (regionId) {
    sendRegionalWeatherWebhook(regionId);
  } else {
    sendAllRegionalWebhooks();
  }
}

module.exports = {
  sendRegionalWeatherWebhook,
  sendAllRegionalWebhooks,
};
