const messages = require('../messages');

const setVolume = async (message) => {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_IN_VOICE_CHANNEL);
  }

  const volume = args[2]/100;
  const serverQueue = message.client.queue.get(message.guild.id);

  if (serverQueue) {
    serverQueue.connection.dispatcher.setVolume(volume);
    serverQueue.volume = volume;
    return message.channel.send(messages.CHANGE_VOLUME);
  }

  return message.channel.send(messages.NO_SONGS);
}

module.exports = setVolume;
