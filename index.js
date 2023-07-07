const Discord = require("discord.js");
const {
  Client,
  GatewayIntentBits,
} = require('discord.js');

const config = require('./config.json');
const crypto = require('crypto');
  
const tokens = config.tokens; // All tokens you want to use for spam
const guildId = config.guildId // Discord server ID
const entityId = config.entityId // Channel or User ID

function generateRandomToken(length) {
  const token = crypto.randomBytes(length).toString('hex');
  return token;
}

const clients = tokens.map(token => new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] }));

async function sendMessage(client, configDefinedMessage) {
  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    let entity, targetType, messageToSend;

    try {
      const user = await client.users.fetch(entityId);
      if (user) { entity = user; targetType = 'userType';}
    } catch (error) {
      const channel = await client.channels.fetch(entityId);
      if (channel) { entity = channel;targetType = 'channelType';}
    }

    if (entity) {
      if(config.messageAsMatrix) { messageToSend = generateRandomToken(800) } else { messageToSend = configDefinedMessage }
      if (targetType === 'userType') {
        const dmChannel = await entity.createDM();
        dmChannel.send(messageToSend)
          .then(() => console.log(`[${new Date().toLocaleString('fr-FR')}] Message successfully sent to ${entity.tag} (${client.user.tag})`))
          .catch(error => console.error(`[${new Date().toLocaleString('fr-FR')}] Error sending message to ${entity.tag}:`, error));
      } else if (targetType === 'channelType') {
        entity.send(messageToSend)
          .then(() => console.log(`[${new Date().toLocaleString('fr-FR')}] Message successfully sent in the channel ${entity.name} (${client.user.tag})`))
          .catch(error => console.error(`[${new Date().toLocaleString('fr-FR')}] Error sending message in channel ${entity.name}:`, error));
      }
    } else {
      console.error(`[${new Date().toLocaleString('fr-FR')}] The entity with ID ${entityId} was not found in guild ${guild.name}.`);
    }
  } else {
    console.error(`[${new Date().toLocaleString('fr-FR')}] Guild with ID ${guildId} not found`);
  }
}

clients.forEach((client, index) => {
  client.on('ready', () => {
    console.log(`[${new Date().toLocaleString('fr-FR')}] Client ${index + 1} connected as ${client.user.tag}`);
    setInterval(() => {
      sendMessage(client, config.messageToSend);
    }, 500);
  });

  client.login(tokens[index]);
});