#!/usr/bin/env node

/**
 * Test script for local development
 * Tests the webhook functionality without triggering GitHub Actions
 */

const { sendWeatherWebhook } = require("./src/webhook");
const { logger } = require("./src/utils/logger");

async function testWebhook() {
  console.log("🧪 Testing Discord webhook...");
  console.log("Make sure your .env file has the WEBHOOK_URL configured.");
  console.log("");

  try {
    await sendWeatherWebhook();
    console.log("");
    console.log("🎉 Test completed successfully!");
    console.log("Check your Discord channel for the weather update.");
  } catch (error) {
    console.error("");
    console.error("💥 Test failed:", error.message);
    console.error("");
    console.error("Common issues:");
    console.error("- Missing WEBHOOK_URL in .env file");
    console.error("- Invalid webhook URL");
    console.error("- Network connectivity problems");
    console.error("- Webhook permissions/channel access");
    process.exit(1);
  }
}

if (require.main === module) {
  testWebhook();
}

module.exports = { testWebhook };
