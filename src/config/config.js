require("dotenv").config();

const config = {
  WEBHOOK_URL: process.env.WEBHOOK_URL,
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
