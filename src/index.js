const { BotClient } = require("./bot/client");
const { loadCommands } = require("./bot/loadCommands");
const { onReady } = require("./bot/events/ready");
const { onInteractionCreate } = require("./bot/events/interactionCreate");
const { config } = require("./config/config");
const { GatewayIntentBits } = require("discord.js");
const { startWeatherScheduler } = require("./bot/weatherScheduler");

const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  startWeatherScheduler(client);
  onReady(client);
});
client.on("interactionCreate", onInteractionCreate);

loadCommands(client);

client.login(config.BOT_TOKEN);
