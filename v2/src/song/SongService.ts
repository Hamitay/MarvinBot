import { Message, VoiceChannel } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../queue';
import ChannelQueue from '../queue/ChannelQueue';
import YoutubeService from '../thirdParty/YoutubeService';
import { SongInfo } from './SongInfo';

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

  public async playSongAtChannel(
    songUrl: string,
    voiceChannel: VoiceChannel,
    messageContext: Message
  ): Promise<SongInfo[]> {
    const songs = await this.getSongInfo(songUrl);
    this.#queueService.addSongsToQueue(messageContext, songs);

    const queue = await this.#queueService.connectQueueToChannel(
      messageContext,
      voiceChannel
    );
    this.execute(queue);
    return songs;
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

  public async getSongStream(url: string) {
    return await this.#youtubeService.getVideoStream(url);
  }
}
