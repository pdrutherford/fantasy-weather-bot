const {
  getRegionalWeatherUpdate,
  getWeatherEmoji,
} = require("./src/services/weatherService");
const {
  getConfiguredRegions,
  getRegionConfig,
} = require("./src/config/config");
const { logger } = require("./src/utils/logger");

// Mock webhook function for testing
async function mockSendWebhook(regionConfig, messageContent) {
  console.log(`\n🔧 MOCK WEBHOOK SEND TO: ${regionConfig.name}`);
  console.log(`📡 Webhook URL: ${regionConfig.webhookUrl}`);
  console.log("📝 Message Content:");
  console.log("─".repeat(50));
  console.log(messageContent);
  console.log("─".repeat(50));
  return { status: 204 }; // Mock successful response
}

async function testRegionalWeatherWebhook(regionId) {
  try {
    // Load configuration from regions-example.json instead of regions.json
    const fs = require("fs");
    const path = require("path");

    const exampleRegionsPath = path.join(
      __dirname,
      "src",
      "config",
      "regions-example.json"
    );
    const exampleConfig = JSON.parse(
      fs.readFileSync(exampleRegionsPath, "utf8")
    );

    if (!exampleConfig.regions || !exampleConfig.regions[regionId]) {
      throw new Error(
        `Region '${regionId}' not found in example configuration`
      );
    }

    const regionConfig = {
      id: regionId,
      ...exampleConfig.regions[regionId],
    };

    logger.info(`Testing weather update for region: ${regionConfig.name}`);

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
      `${getWeatherEmoji(weather.condition, false)} **Weather:** ${
        weather.condition
      }\n`;

    // Add mechanical impacts if any
    if (Array.isArray(weather.impacts) && weather.impacts.length > 0) {
      weather.impacts.forEach((impact) => {
        messageContent += `⚠️ ${impact}\n`;
      });
    }

    // Send to mock webhook
    const response = await mockSendWebhook(regionConfig, messageContent);

    if (response.status === 204) {
      logger.info(
        `TEST: Weather update would be posted successfully for region: ${regionConfig.name}`
      );
      console.log(
        `✅ TEST: Weather update would be posted successfully for ${regionConfig.name}!`
      );
    }
  } catch (error) {
    logger.error(
      `TEST: Failed to send weather webhook for region ${regionId}: ${error.message}`
    );
    console.error(
      `❌ TEST: Failed to send weather update for ${regionId}:`,
      error.message
    );
  }
}

async function testAllRegionalWebhooks() {
  try {
    // Load configuration from regions-example.json instead of regions.json
    const configModule = require("./src/config/config");
    const fs = require("fs");
    const path = require("path");

    // Override the regions config with example data
    const exampleRegionsPath = path.join(
      __dirname,
      "src",
      "config",
      "regions-example.json"
    );
    const exampleConfig = JSON.parse(
      fs.readFileSync(exampleRegionsPath, "utf8")
    );
    configModule.regionsConfig = exampleConfig;

    const configuredRegions = Object.entries(exampleConfig.regions)
      .filter(([_, region]) => region.webhookUrl)
      .map(([regionId, region]) => ({
        id: regionId,
        ...region,
      }));

    if (configuredRegions.length === 0) {
      logger.warn("No regions configured with webhook URLs in example file");
      console.log("⚠️ No regions configured with webhook URLs in example file");
      return;
    }

    logger.info(
      `Testing weather updates for ${configuredRegions.length} regions from example config`
    );

    for (const region of configuredRegions) {
      await testRegionalWeatherWebhook(region.id);
    }

    console.log(
      `✅ TEST: All ${configuredRegions.length} regional weather updates tested successfully!`
    );
  } catch (error) {
    logger.error(`TEST: Failed to test regional webhooks: ${error.message}`);
    console.error("❌ TEST: Failed to test regional webhooks:", error.message);
  }
}

// If this script is run directly
if (require.main === module) {
  const regionId = process.argv[2];

  if (regionId) {
    testRegionalWeatherWebhook(regionId);
  } else {
    testAllRegionalWebhooks();
  }
}

module.exports = {
  testRegionalWeatherWebhook,
  testAllRegionalWebhooks,
};
