import { VoiceBasedChannel } from "discord.js";
import { singleton } from "tsyringe";
import { QueryType, useMasterPlayer, useQueue } from "discord-player";

@singleton()
export default class SongService {
  public async playSongAtConnection(
    songUrl: string,
    voiceConnection: VoiceBasedChannel
  ) {
    const player = useMasterPlayer();

    if (!player) {
      throw new Error("Player not initialized!");
    }

    const result = await player.search(songUrl, {
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (result.isEmpty()) {
      throw new Error("Invalid video");
    }

    return await player.play(voiceConnection, result);
  }

  public async playPlaylistAtConnection(
    playlistUrl: string,
    voiceConnection: VoiceBasedChannel
  ) {
    const player = useMasterPlayer();

    if (!player) {
      throw new Error("Player not initialized!");
    }

    const result = await player.search(playlistUrl, {
      searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (result.isEmpty() || !result.hasPlaylist()) {
      throw new Error("Invalid playlist");
    }

    const { playlist, tracks } = result;

    const { queue } = await player.play(voiceConnection, result);

    queue.clear;

    return { tracks, queue, playlist };
  }

  public async stopPlaylist(voiceConnection: VoiceBasedChannel) {
    const { guildId } = voiceConnection;

    const queue = await useQueue(guildId);
    await queue?.delete();
  }

  public async skipPlaylist(
    voiceConnection: VoiceBasedChannel,
    toSkip: number = 1
  ) {
    const { guildId } = voiceConnection;

    const queue = await useQueue(guildId);

    for (let i = 0; i < toSkip; i++) {
      await queue?.dispatcher?.end();
    }
  }

  public async getQueue(voiceConnection: VoiceBasedChannel) {
    return await useQueue(voiceConnection.guildId);
  }
}
