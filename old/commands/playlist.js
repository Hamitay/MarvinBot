const fs = require('fs');
const shuffle = require('shuffle-array');

const messages = require('../messages');
const { play } = require('../player');
const { DEFAULT_VOLUME } = require('./constants');

const playlist = async (message) => {
  const playlistName = message.content.split(" ")[2];

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_IN_VOICE_CHANNEL);
  }

  fs.readdir(`./playlists/${playlistName}`, async (err, files) => {
    if (err) {
      // Handle error
      return message.channel.send(messages.UNKNOWN_PLAYLIST)
    }

    const songs = shuffle(
      files.map((file) => ({
      title: file,
      url: `./playlists/${playlistName}/${file}`,
      isYoutube: false,
    })));

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs,
      volume: DEFAULT_VOLUME,
      playing: true,
    };

    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;

      play(queueConstruct.songs[0], message);
    } catch (err) {
      console.error(err);
      queue.delete(message.guild.id);

      return message.channel.send(messages.UNKNOWN_ERROR(error));
    }
  });
}

module.exports = playlist;
