import { Message, VoiceChannel } from "discord.js";
import { singleton } from "tsyringe";
import { SongInfo } from "../song/SongInfo";
import ChannelQueue from "./ChannelQueue";

const DEFAULT_VOLUME = 1;
@singleton()
export default class QueueService {
  #queueMap: Map<string, ChannelQueue>;

  constructor() {
    this.#queueMap = new Map();
  }

  public createQueue(guildId: string, queueConstruct: ChannelQueue): void {
    this.#queueMap.set(guildId, queueConstruct);
  }

  public getQueue(guildId: string): ChannelQueue | undefined {
    return this.#queueMap.get(guildId);
  }

  public addSongsToQueue(messageContext: Message, songs: SongInfo[], loop?: boolean) {
    const guildId = messageContext.guild?.id;
    if (!guildId) {
      throw new Error("Guild id not provided");
    }

    const queue = this.getQueue(guildId);

    if (!queue) {
      const queueConstruct = {
        guildId,
        textChannel: messageContext.channel,
        voiceChannel: messageContext.member?.voice.channel,
        connection: undefined,
        songs: songs,
        volume: DEFAULT_VOLUME,
        playing: true,
        loop,
      };

      this.createQueue(guildId, queueConstruct);
    } else {
      songs.forEach((song) => queue.songs?.push(song));
    }
  }

  public async connectQueueToChannel(messageContext: Message, voiceChannel: VoiceChannel): Promise<ChannelQueue> {
    const guildId = messageContext.guild?.id;
    if (!guildId) {
      throw new Error("Guild id not provided");
    }

    const queue = this.getQueue(guildId);

    if (!queue) {
      throw new Error("Undefined guild");
    }

    queue.connection = await voiceChannel.join();
    return queue;
  }

  public async deleteQueueById(guildId: string) {
    const queue = this.getQueue(guildId);
    if (queue) {
      await this.deleteQueue(queue);
    }
  }

  public async purgeQueueById(guildId: string) {
    const queue = this.getQueue(guildId);
    if (queue) {
      this.#queueMap.delete(queue.guildId)
    }
  }

  public async deleteQueue(queue: ChannelQueue) {
    await queue.connection?.dispatcher?.end();
    await queue.voiceChannel?.leave();
    this.#queueMap.delete(queue.guildId);
  }
}
