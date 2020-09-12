const messages = require('../messages');

const stop = async (message) => {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  };

  const serverQueue = message.client.queue.get(message.guild.id);

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

module.exports = stop;
