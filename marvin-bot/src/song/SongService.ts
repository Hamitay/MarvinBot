import { Message, VoiceChannel } from "discord.js";
import internal from "stream";
import { injectable } from "tsyringe";
import QueueService from "../queue";
import ChannelQueue from "../queue/ChannelQueue";
import YoutubeService from "../thirdParty/YoutubeService";
import { SongInfo } from "./SongInfo";

enum StreamType {
  YOUTUBE,
  SOUNDCLOUD,
  PLAYLIST
}

const YOUTUBE_URL = "youtube.com";
const SOUNDCLOUD_URL = "soundcloud.com";
const PLAYLIST_URL = "/playlist/";
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
    messageContext: Message,
    loop?: boolean,
  ) {
    const guildId = messageContext.guild?.id;

    if (guildId) {
      await this.#queueService.purgeQueueById(guildId);
      this.#queueService.addSongsToQueue(messageContext, songs, loop);

      const queue = await this.#queueService.connectQueueToChannel(
        messageContext,
        voiceChannel,
      );
      await this.execute(queue);

      return songs;
    } else {
      throw new Error("No guild id");
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
      throw new Error("No guild id");
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
      ?.play(stream, { type: "unknown" })
      .on("finish", () => {
        const playedSong = queue.songs?.shift();

        if(queue.loop && playedSong) {
          queue.songs?.push(playedSong)
        }

        this.execute(queue);
      })
      .on("error", (err) => {
        console.error(err);
        this.#queueService.deleteQueue(queue);
      });

    dispatcher?.setVolume(queue.volume);
  }

  public async getSongStream(url: string): Promise<internal.Readable | string> {
    const streamType = this.getStreamType(url);

    switch (streamType) {
      case StreamType.YOUTUBE:
        return await this.#youtubeService.getVideoStream(url);
      case StreamType.PLAYLIST:
        return url;
      default:
        throw new Error("Unsuported Stream Type");
    }
  }

  public getStreamType(url: string): StreamType {
    if (url.includes(PLAYLIST_URL)) {
      return StreamType.PLAYLIST;
    }
    
    if (url.includes(YOUTUBE_URL)) {
      return StreamType.YOUTUBE;
    }

    if (url.includes(SOUNDCLOUD_URL)) {
      return StreamType.SOUNDCLOUD;
    }

    throw new Error("Invalid Stream type");
  }
}
