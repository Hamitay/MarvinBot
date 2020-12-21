const Discord = require('discord.js');

const { prefix, alias } = require('./config.json');
const messages = require('./messages');
const commands = require('./commands');

const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client();
client.login(token);
client.queue = new Map();

client.once('ready', () => {
  console.log(messages.DEFAULT_MESSAGE);
});

client.once('reconnecting', () => {
  console.log(messages.DEFAULT_FAILURE_MESSAGE);
});

client.once('disconnect', () => {
  console.log(messages.DEFAULT_GOODBYE);
});

client.on('message', async (message) => {
  if(message.author.bot) return;

  const validMessage = message.content.startsWith(prefix) || message.content.startsWith(alias);
  if(!validMessage) return;

  const args = message.content.split(" ");
  const command = args[1];

  if (command in commands) {
    return commands[command].function(message);
  }

  return message.channel.send(messages.ASK_FOR_HELP_MESSAGE);
});

