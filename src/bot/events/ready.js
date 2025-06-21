async function onReady(client) {
  console.log(
    `Bot is online and ready to serve in ${client.guilds.cache.size} servers!`
  );

  // Register slash commands
  try {
    console.log("Started refreshing application (/) commands.");

    const commands = [];
    client.commands.forEach((command) => {
      commands.push(command.data.toJSON());
    });

    await client.application.commands.set(commands);

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

module.exports = { onReady };
