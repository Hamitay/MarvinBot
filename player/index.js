const ytdl = require("ytdl-core");
const scdl = require("soundcloud-downloader");

const YOUTUBE_URL = "youtube.com";
const SOUNDCLOUD_URL = "soundcloud.com";
const PLAYLIST_URL = "/playlists/";

const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;

const play = async (song, message) => {
  const { client, guild} = message;

  const { queue } = client;
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  let stream = null;

  try {
    stream = await resolveStream(song);
  } catch(error) {
    console.error(error);
    serverQueue.songs.shift();
    play(serverQueue.songs[0], message);
  }

  const dispatcher = serverQueue.connection
                                .play(stream, { type: 'unknown' })
                                .on("finish", () => {
                                  serverQueue.songs.shift();
                                  play(serverQueue.songs[0], message)
                                }).on("error", (err) => {
                                  console.error(err);
                                  serverQueue.songs = [];
                                  serverQueue.connection.dispatcher.end();
                                });

  dispatcher.setVolume(serverQueue.volume);
}

const resolveStream = async (song) => {
  if (isYoutube(song)) {
    return await ytdl(song.url);
  }

  if (isSoundcloud(song)) {
    return await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
  }

  if (isPlaylist(song)) {
    return song.url;
  }
  throw new Error("Invalid stream");
}

const isYoutube = (song) => song.url.includes(YOUTUBE_URL);
const isSoundcloud = (song) => song.url.includes(SOUNDCLOUD_URL);
const isPlaylist = (song) => song.url.includes(PLAYLIST_URL);

module.exports = {
  play,
  resolveStream,
  isYoutube,
  isSoundcloud,
};
