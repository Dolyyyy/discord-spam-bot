const Discord = require("discord.js");
const { Client, GatewayIntentBits } = require('discord.js');
const crypto = require('crypto');

const config = require('./config.json');

function generateRandomToken(length) {
  const token = crypto.randomBytes(length).toString('hex');
  return token;
}

const spamBot = {
  clients: config.tokens.map(token => new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] })),

  async sendMessage(client, configDefinedMessage) {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      let entity, targetType, messageToSend;

      try {
        const user = await client.users.fetch(config.entityId);
        if (user) {
          entity = user;
          targetType = 'userType';
        }
      } catch (error) {
        const channel = await client.channels.fetch(config.entityId);
        if (channel) {
          entity = channel;
          targetType = 'channelType';
        }
      }

      if (entity) {
        if (config.messageAsMatrix) {
          messageToSend = generateRandomToken(800);
        } else {
          messageToSend = configDefinedMessage;
        }

        if (targetType === 'userType') {
          const dmChannel = await entity.createDM();
          dmChannel
            .send(messageToSend)
            .then(() => console.log(`[${new Date().toLocaleString('fr-FR')}] Message successfully sent to ${entity.tag} (${client.user.tag})`))
            .catch(error => console.error(`[${new Date().toLocaleString('fr-FR')}] Error sending message to ${entity.tag}:`, error));
        } else if (targetType === 'channelType') {
          entity
            .send(messageToSend)
            .then(() => console.log(`[${new Date().toLocaleString('fr-FR')}] Message successfully sent in the channel ${entity.name} (${client.user.tag})`))
            .catch(error => console.error(`[${new Date().toLocaleString('fr-FR')}] Error sending message in channel ${entity.name}:`, error));
        }
      } else {
        console.error(`[${new Date().toLocaleString('fr-FR')}] The entity with ID ${config.entityId} was not found in guild ${guild.name}.`);
      }
    } else {
      console.error(`[${new Date().toLocaleString('fr-FR')}] Guild with ID ${config.guildId} not found`);
    }
  },

  start() {
    this.clients.forEach((client, index) => {
      client.on('ready', () => {
        console.log(`[${new Date().toLocaleString('fr-FR')}] Client ${index + 1} connected as ${client.user.tag}`);
        setInterval(() => {
          this.sendMessage(client, config.messageToSend);
        }, config.interval);
      });

      client.login(config.tokens[index]);
    });
  },
};

spamBot.start();