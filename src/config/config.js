require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Load regional configurations with flexible file discovery
const loadRegionsConfig = () => {
  // 1. Try to load from REGIONS_CONFIG environment variable (for GitHub Actions)
  if (process.env.REGIONS_CONFIG) {
    try {
      const config = JSON.parse(process.env.REGIONS_CONFIG);
      console.log(
        `[CONFIG] Loaded regions configuration from REGIONS_CONFIG environment variable`
      );
      return config;
    } catch (error) {
      console.warn(
        `[CONFIG] Failed to parse REGIONS_CONFIG environment variable: ${error.message}`
      );
    }
  }

  // 2. Priority order for regions configuration files
  const possiblePaths = [
    // Custom user file (highest priority)
    path.join(process.cwd(), "regions.json"),
    path.join(process.cwd(), "config", "regions.json"),
    path.join(process.cwd(), "src", "config", "custom-regions.json"),

    // Default example file (fallback)
    path.join(__dirname, "regions.json"),
    path.join(__dirname, "regions-example.json"),
  ];

  for (const regionsPath of possiblePaths) {
    try {
      if (fs.existsSync(regionsPath)) {
        const config = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
        console.log(
          `[CONFIG] Loaded regions configuration from: ${regionsPath}`
        );
        return config;
      }
    } catch (error) {
      console.warn(
        `[CONFIG] Failed to load regions from ${regionsPath}: ${error.message}`
      );
    }
  }

  // No regions file found - return empty config
  console.log("[CONFIG] No regions configuration found");
  return { regions: {} };
};

let regionsConfig = loadRegionsConfig();

// Build simplified config - only need the weekly forecast webhook URL
const config = {
  // Consolidated weekly forecast webhook (all regions in one channel)
  WEEKLY_FORECAST_WEBHOOK_URL: process.env.WEEKLY_FORECAST_WEBHOOK_URL,
};

// Function to validate specific environment variables
const validateConfig = (requiredVars = [], optionalVars = []) => {
  for (const varName of requiredVars) {
    if (!config[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      process.exit(1);
    }
  }

  // Warn about optional variables
  for (const varName of optionalVars) {
    if (!config[varName]) {
      console.warn(`Optional environment variable not set: ${varName}`);
    }
  }
};

// Function to get all configured regions
const getConfiguredRegions = () => {
  if (!regionsConfig.regions) return [];

  return Object.entries(regionsConfig.regions)
    .filter(([_, region]) => region.webhookUrl) // Only include regions with webhook URLs in the JSON
    .map(([regionId, region]) => ({
      id: regionId,
      ...region,
    }));
};

// Function to get a specific region configuration
const getRegionConfig = (regionId) => {
  if (!regionsConfig.regions || !regionsConfig.regions[regionId]) {
    throw new Error(`Region '${regionId}' not found in configuration`);
  }

  const region = regionsConfig.regions[regionId];

  // Check if webhook URL is configured in the JSON
  if (!region.webhookUrl) {
    throw new Error(`Webhook URL not configured for region '${regionId}'`);
  }

  return {
    id: regionId,
    ...region,
  };
};

// Function to get the consolidated weekly forecast webhook URL
const getWeeklyForecastWebhookUrl = () => {
  return config.WEEKLY_FORECAST_WEBHOOK_URL;
};

// Function to validate region webhook configuration
const validateRegionConfig = (regionId) => {
  const region = getRegionConfig(regionId);

  if (!region.webhookUrl) {
    throw new Error(`Webhook URL not configured for region '${regionId}'`);
  }

  return region;
};

// Function to validate a custom region definition
const validateRegionDefinition = (regionId, regionData) => {
  const errors = [];

  // Check required fields
  if (!regionData.name) {
    errors.push(`Region '${regionId}' missing required field: name`);
  }
  if (!regionData.webhookUrl) {
    errors.push(`Region '${regionId}' missing required field: webhookUrl`);
  }

  // Check seasonal weather structure
  if (!regionData.seasonalWeather) {
    errors.push(`Region '${regionId}' missing required field: seasonalWeather`);
  } else {
    const requiredSeasons = ["spring", "summer", "autumn", "winter"];
    const seasons = Object.keys(regionData.seasonalWeather);

    for (const season of requiredSeasons) {
      if (!seasons.includes(season)) {
        errors.push(`Region '${regionId}' missing season: ${season}`);
        continue;
      }

      const seasonData = regionData.seasonalWeather[season];
      if (
        !seasonData.dayConditions ||
        !Array.isArray(seasonData.dayConditions)
      ) {
        errors.push(
          `Region '${regionId}' season '${season}' missing or invalid dayConditions array`
        );
      }
      if (
        !seasonData.nightConditions ||
        !Array.isArray(seasonData.nightConditions)
      ) {
        errors.push(
          `Region '${regionId}' season '${season}' missing or invalid nightConditions array`
        );
      }

      // Check for empty arrays
      if (seasonData.dayConditions && seasonData.dayConditions.length === 0) {
        errors.push(
          `Region '${regionId}' season '${season}' dayConditions cannot be empty`
        );
      }
      if (
        seasonData.nightConditions &&
        seasonData.nightConditions.length === 0
      ) {
        errors.push(
          `Region '${regionId}' season '${season}' nightConditions cannot be empty`
        );
      }
    }
  }

  return errors;
};

// Function to validate all regions in the current configuration
const validateAllRegions = () => {
  const allErrors = [];

  if (!regionsConfig.regions) {
    return ["No regions configuration found"];
  }

  Object.entries(regionsConfig.regions).forEach(([regionId, regionData]) => {
    const errors = validateRegionDefinition(regionId, regionData);
    allErrors.push(...errors);
  });

  return allErrors;
};

// Function to create a region template
const createRegionTemplate = (regionId, regionName) => {
  return {
    name: regionName,
    webhookUrl:
      "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
    seasonalWeather: {
      spring: {
        dayConditions: [
          "Mild spring weather",
          "Pleasant spring day",
          "Spring showers",
          "Warming temperatures",
          "Fresh spring air",
        ],
        nightConditions: [
          "Cool spring night",
          "Clear spring evening",
          "Mild spring temperatures",
          "Gentle spring breeze",
          "Pleasant spring night",
        ],
      },
      summer: {
        dayConditions: [
          "Warm summer day",
          "Hot and sunny",
          "Summer heat",
          "Bright summer weather",
          "Intense summer sun",
        ],
        nightConditions: [
          "Warm summer night",
          "Balmy evening",
          "Summer night breeze",
          "Comfortable summer temperatures",
          "Pleasant summer evening",
        ],
      },
      autumn: {
        dayConditions: [
          "Crisp autumn day",
          "Fall weather",
          "Changing seasons",
          "Autumn breeze",
          "Cool autumn temperatures",
        ],
        nightConditions: [
          "Chilly autumn night",
          "Fall evening",
          "Cool autumn air",
          "Crisp autumn night",
          "Autumn chill",
        ],
      },
      winter: {
        dayConditions: [
          "Cold winter day",
          "Winter chill",
          "Freezing temperatures",
          "Winter weather",
          "Harsh winter conditions",
        ],
        nightConditions: [
          "Frigid winter night",
          "Freezing winter evening",
          "Bitter cold night",
          "Winter freeze",
          "Icy winter night",
        ],
      },
    },
  };
};

// Function to get regions file path (for saving custom regions)
const getRegionsFilePath = () => {
  const customPath = path.join(process.cwd(), "regions.json");
  return customPath;
};

module.exports = {
  config,
  validateConfig,
  regionsConfig,
  getConfiguredRegions,
  getRegionConfig,
  validateRegionConfig,
  getWeeklyForecastWebhookUrl,
  validateRegionDefinition,
  validateAllRegions,
  createRegionTemplate,
  getRegionsFilePath,
};
