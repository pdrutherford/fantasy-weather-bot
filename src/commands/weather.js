const { SlashCommandBuilder } = require("@discordjs/builders");
const weatherService = require("../services/weatherService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get the daily weather update for the campaign"),
  async execute(interaction) {
    try {
      const weather = weatherService.getWeatherUpdate();
      const weatherMessage =
        `🌤️ **Weather Update**\n` +
        `**Date:** ${weather.date}\n` +
        `**Season:** ${
          weather.season.charAt(0).toUpperCase() + weather.season.slice(1)
        }\n` +
        `**Day:** ${weather.day.condition}\n` +
        `**Night:** ${weather.night.condition}`;

      await interaction.reply(weatherMessage);
    } catch (error) {
      console.error("Weather command error:", error);
      await interaction.reply({
        content: "Sorry, I couldn't fetch the weather update.",
        flags: 64, // This is the ephemeral flag
      });
    }
  },
};
