class BotClient extends require("discord.js").Client {
  constructor(options) {
    super(options);
  }

  async registerCommands(commands) {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const config = require("../config/config");

    const rest = new REST({ version: "9" }).setToken(config.BOT_TOKEN);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { BotClient };
