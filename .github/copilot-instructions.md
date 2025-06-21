# GitHub Copilot Instructions for Discord Weather Bot

## Project Overview

This is a Discord bot that provides weather updates for fictional campaigns. The bot uses Discord.js v14 and follows a modular architecture pattern.

## Code Style Guidelines

- Use CommonJS (`require`/`module.exports`) syntax, not ES6 modules
- Prefer async/await over callbacks
- Use descriptive variable names
- Add error handling to all async operations
- Log errors using the custom logger utility

## Architecture Patterns

- **Command Pattern**: All commands should be in `/src/commands/` and follow the structure in [`weather.js`](../src/commands/weather.js)
- **Service Layer**: Business logic should be in `/src/services/`
- **Event Handlers**: Discord events go in `/src/bot/events/`
- **Singleton Pattern**: Use for bot client and configuration

## Key Components

- **Bot Client**: Extended Discord.js client in [`client.js`](../src/bot/client.js)
- **Logger**: Custom logging utility in [`logger.js`](../src/utils/logger.js)
- **Config**: Centralized configuration in [`config.js`](../src/config/config.js)
- **Weather Service**: Core weather logic in [`weatherService.js`](../src/services/weatherService.js)

## Command Structure

When creating new commands:

1. Use SlashCommandBuilder from @discordjs/builders
2. Export an object with `data` and `execute` properties
3. Handle errors gracefully with ephemeral responses
4. Use the weather command as a template

## Environment Variables

Required variables are defined in [`.env.example`](../.env.example):

- `BOT_TOKEN`: Discord bot token
- `CLIENT_ID`: Bot's application ID
- `GUILD_ID`: Target guild/server ID
- `WEATHER_CHANNEL_ID`: Channel for weather updates

## Common Tasks

### Adding a New Command

1. Create a new file in `/src/commands/`
2. Follow the structure of [`weather.js`](../src/commands/weather.js)
3. The command will be auto-loaded by [`loadCommands.js`](../src/bot/loadCommands.js)

### Modifying Weather Data

- Edit weather conditions array in [`weatherService.js`](../src/services/weatherService.js)
- Adjust temperature ranges or add new weather properties
- Consider adding seasonal variations

### Error Handling

- Always wrap async operations in try-catch blocks
- Use the logger for error tracking
- Send ephemeral error messages to users
- Never expose sensitive information in error messages

## Testing Recommendations

- Test commands in a development Discord server first
- Verify environment variables are loaded correctly
- Check command registration in Discord
- Test error scenarios (missing permissions, API failures)

## Security Considerations

- Never commit `.env` files
- Validate all user inputs
- Use ephemeral messages for sensitive responses
- Keep bot permissions minimal

## Future Enhancement Ideas

- Scheduled weather posts
- Weather history tracking
- Multiple location support
- Weather-based campaign events
- User preferences storage
- Weather forecast predictions
