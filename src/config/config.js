require("dotenv").config();

const config = {
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  GM_WEBHOOK_URL: process.env.GM_WEBHOOK_URL,
};

// Validate required environment variables
const requiredVars = ["WEBHOOK_URL"];
const optionalVars = ["GM_WEBHOOK_URL"];
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

module.exports = { config };
