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
        `🌤️ **Today's Weather**\n` +
        `**Condition:** ${weather.condition}\n` +
        `**Temperature:** ${weather.temperature}°C\n` +
        `**Humidity:** ${weather.humidity}%`;

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
