import { Message, VoiceChannel } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../queue';
import ChannelQueue from '../queue/ChannelQueue';
import YoutubeService from '../thirdParty/YoutubeService';
import { SongInfo } from './SongInfo';

enum StreamType {
  YOUTUBE,
  SOUNDCLOUD,
  PLAYLIST
}

const YOUTUBE_URL = 'youtube.com';
const SOUNDCLOUD_URL = 'soundcloud.com';
const PLAYLIST_URL = '/playlists/';
@injectable()
export default class SongService {
  #youtubeService: YoutubeService;

  #queueService: QueueService;

  constructor(youtubeService: YoutubeService, queueService: QueueService) {
    this.#youtubeService = youtubeService;
    this.#queueService = queueService;
  }

  public async getSongInfo(url: string): Promise<SongInfo[]> {
    return await this.#youtubeService.getSongInfo(url);
  }

  public async playPlaylistAtChannel(
    songs: SongInfo[],
    voiceChannel: VoiceChannel,
    messageContext: Message
  ) {
    const guildId = messageContext.guild?.id;

    if (guildId) {
      await this.#queueService.purgeQueueById(guildId);
      this.#queueService.addSongsToQueue(messageContext, songs);

      const queue = await this.#queueService.connectQueueToChannel(
        messageContext,
        voiceChannel
      );
      await this.execute(queue);

      return songs;
    } else {
      throw new Error('No guild id');
    }
  }

  public async playSongAtChannel(
    songUrl: string,
    voiceChannel: VoiceChannel,
    messageContext: Message
  ): Promise<SongInfo[]> {
    const songs = await this.getSongInfo(songUrl);

    const guildId = messageContext.guild?.id;

    if (guildId) {
      const currentQueue = this.#queueService.getQueue(guildId);
      this.#queueService.addSongsToQueue(messageContext, songs);

      if (!currentQueue || !currentQueue.playing) {
        const queue = await this.#queueService.connectQueueToChannel(
          messageContext,
          voiceChannel
        );
        this.execute(queue);
      }

      return songs;
    } else {
      throw new Error('No guild id');
    }
  }

  public async execute(queue: ChannelQueue) {
    const songs = queue.songs;
    if (!songs || songs.length === 0) {
      this.#queueService.deleteQueue(queue);
      return;
    }

    const stream = await this.getSongStream(songs[0].url);

    const dispatcher = queue.connection
      ?.play(stream, { type: 'unknown' })
      .on('finish', () => {
        queue.songs?.shift();
        this.execute(queue);
      })
      .on('error', (err) => {
        console.error(err);
        this.#queueService.deleteQueue(queue);
      });

    dispatcher?.setVolume(queue.volume);
  }

  public async getSongStream(url: string): Promise<any> {
    const streamType = this.getStreamType(url);

    switch (streamType) {
      case StreamType.YOUTUBE:
        return await this.#youtubeService.getVideoStream(url);
      case StreamType.PLAYLIST:
        return url;
      default:
        throw new Error('Unssuported Stream Type');
    }
  }

  public getStreamType(url: string): StreamType {
    if (url.includes(YOUTUBE_URL)) {
      return StreamType.YOUTUBE;
    }

    if (url.includes(SOUNDCLOUD_URL)) {
      return StreamType.SOUNDCLOUD;
    }

    if (url.includes(PLAYLIST_URL)) {
      return StreamType.PLAYLIST;
    }

    throw new Error('Invalid Stream type');
  }
}
