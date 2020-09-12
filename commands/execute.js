const ytdl = require('ytdl-core');
const scdl = require("soundcloud-downloader");

const messages = require('../messages');
const { play, isYoutube, isSoundcloud,  } = require('../player');

const execute = async (message) => {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  }

  const song = await buildSong(args[2]);
  const serverQueue = message.client.queue.get(message.guild.id);

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs: [],
      volume: 1,
      playing: true,
    };

    // Add that channels queue to the server queues
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;

      play(queueConstruct.songs[0], message);
    } catch (err) {
      console.error(err);
      queue.delete(message.guild.id);
      return message.channel.send(messages.UNKNOWN_ERROR(err));
    }

  } else {
    serverQueue.songs.push(song);
    return message.channel.send(messages.PLAYING_SONG(song.title));
  }
}

const buildSong = async (url) => {
  // Get soundcloud song info
  if (isYoutube(song)) {
    const songInfo = await ytdl.getInfo(url);
    return {
      title: songInfo.title,
      url: songInfo.video_url,
    };
  };

  if (isSoundcloud(song)) {
    const songInfo = await scdl.getInfo(url)
    return {
      title: songInfo.title,
      url,
    };
  };

  return {
    title: '',
    url
  };
}

module.exports = execute;
