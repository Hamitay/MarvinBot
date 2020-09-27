const ytdl = require("ytdl-core");
const ytpl = require("ytpl")
const scdl = require("soundcloud-downloader");

const messages = require("../messages");
const { play, isYoutube, isSoundcloud, isYoutubePlaylist } = require("../player");

const execute = async (message) => {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_IN_VOICE_CHANNEL);
  }

  const songs = await buildSongs(args[2]);
  const serverQueue = message.client.queue.get(message.guild.id);

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs,
      volume: 0.2,
      playing: true,
    };

    // Add that channels queue to the server queues
    message.client.queue.set(message.guild.id, queueConstruct);
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
    songs.forEach((song) => serverQueue.songs.push(song));
    return message.channel.send(messages.PLAYING_SONG(songs[0].title));
  }
}

const buildSongs = async (url) => {
  if (isYoutube(url)) {
    if (isYoutubePlaylist(url)) {
      const playlist = await ytpl(url);


      const songs = playlist.items.map((item) => ({
        title: item.title,
        url: item.url,
      }));

      return songs;

    } else {
      const songInfo = await ytdl.getInfo(url);
      return [{
        title: songInfo.title,
        url: songInfo.video_url,
      }];
    }
  }

  if (isSoundcloud(url)) {
    const songInfo = await scdl.getInfo(url)
    return [{
      title: songInfo.title,
      url,
    }];
  };

  return [{
    title: '',
    url
  }];
}

module.exports = execute;
