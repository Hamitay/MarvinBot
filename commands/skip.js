const messages = require('../messages');

const skip = async (message) => {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  };

  const serverQueue = message.client.queue.get(message.guild.id);

  if(!serverQueue) {
    return message.channel.send(messages.NON_SKIPPABLE);
  };

  serverQueue.connection.dispatcher.end();
}

module.exports = skip;
