import { DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import { SongInfo } from "../song/SongInfo";

export default interface ChannelQueue {
  guildId: string,
  textChannel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel | null | undefined,
  connection?: VoiceConnection,
  songs?: SongInfo[],
  volume: number,
  playing?: boolean,
}
