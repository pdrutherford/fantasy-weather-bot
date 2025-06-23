require("dotenv").config();

const config = {
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  GM_WEBHOOK_URL: process.env.GM_WEBHOOK_URL,
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

// Default validation for daily webhook (when config is imported directly)
if (require.main !== module) {
  // Only validate WEBHOOK_URL if this is being imported by webhook.js
  const mainModulePath = require.main ? require.main.filename : "";
  if (
    mainModulePath.includes("webhook.js") &&
    !mainModulePath.includes("weekly-webhook.js")
  ) {
    validateConfig(["WEBHOOK_URL"], ["GM_WEBHOOK_URL"]);
  }
}

module.exports = { config, validateConfig };
