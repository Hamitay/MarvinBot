const { play, resolveStream } = require('../index');

const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader');
jest.mock('ytdl-core');
jest.mock('soundcloud-downloader');

describe('play', () => {

  //Mocks
  const leave = jest.fn();
  const deleteMock = jest.fn();

  const guildId = 'guild-id';

  const guild = {
    id: guildId,
  };

  const client = {
    queue: new Map(),
  };
  const voiceChannel = {
    leave,
  }

  const serverQueue = {
    voiceChannel,
  }

  beforeEach(() => {
    jest.resetModules();
    client.queue.set(guild.id, serverQueue);
  })

  it('should leave and delete queue if there are no songs', () => {
    const message = {
      client,
      guild,
    }
    play(undefined, message);

    expect(leave).toHaveBeenCalled();
    expect(client.queue.get(guildId)).toBeUndefined();
  })
})

describe('resolveStream', () => {
  it('should call ytdl if song is from youtube', () => {
    const url = 'youtube.com/foo';
    resolveStream({
      url,
    });

    expect(ytdl).toHaveBeenCalledWith(url);
    expect(scdl.downloadFormat).toHaveBeenCalledTimes(0);
  });

  it('should call scdl.downloadFormat if song is from soundcloud', () => {
    const url = 'soundcloud.com/foo';
    resolveStream({
      url,
    });

    expect(scdl.downloadFormat).toHaveBeenCalledWith(url, scdl.FORMATS.MP3, process.env.SOUNDCLOUD_CLIENT_ID);
    expect(ytdl).toHaveBeenCalledTimes(0);
  });

  it('should return url if song is from playlist', async () => {
    const url = '/playlists/foo';
    const result = await resolveStream({
      url,
    });

    expect(result).toBe(url);
    expect(scdl.downloadFormat).toHaveBeenCalledTimes(0);
    expect(ytdl).toHaveBeenCalledTimes(0);
  });
});
