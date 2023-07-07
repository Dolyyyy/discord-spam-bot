# Discord Spam Bot

This is a Discord spam bot written in JavaScript using the Discord.js library. It allows you to send messages to a specific user or channel at regular intervals.

## Installation

To install the necessary dependencies, run the following command:

```npm install```


## Usage

To start the spam bot, use the following command:

```npm run start```


The bot will connect using the provided Discord tokens and start sending messages to the specified user or channel.

### Changing the Configuration

The configuration for the spam bot is stored in the `config.json` file. You can modify the following parameters:

- `tokens`: An array of Discord tokens to use for spamming. You can add as many tokens as you want, and the bot will use them in rotation.
- `guildId`: The ID of the Discord server (guild) where the user or channel is located.
- `entityId`: The ID of the user or channel to send the messages to.
- `messageToSend`: The message to send. If `messageAsMatrix` is set to `true`, the bot will generate a random message as a matrix of characters.
- `messageAsMatrix`: Set this to `true` if you want the bot to send a randomly generated message as a matrix of characters.
- `author`: Your name or the author of the bot.

After modifying the configuration, you need to restart the spam bot for the changes to take effect.

## Credits

This bot was created by [Doly](https://codoly.fr).
