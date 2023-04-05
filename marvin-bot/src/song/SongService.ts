import { VoiceBasedChannel } from "discord.js";
import { singleton } from "tsyringe";
import { QueryType, useMasterPlayer } from "discord-player";

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

    return { tracks, queue, playlist };
  }
}
