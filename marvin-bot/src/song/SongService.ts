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

  public async playSongsAtConnection(
    songUrls: string[],
    voiceConnection: VoiceBasedChannel
  ) {
    const player = useMasterPlayer();

    if (!player) {
      throw new Error("Player not initialized");
    }

    (await this.getQueue(voiceConnection))?.clear();

    const queue = await this.createQueue(voiceConnection);

    const tracks = songUrls.map(async (url) => {
      const result = await player.search(url, {
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.hasTracks()) {
        queue.addTrack(result.tracks[0]);
      }
    });

    await Promise.all(tracks);

    if (!queue.isPlaying()) {
      await queue.connect(voiceConnection.id, {
        deaf: true,
      });
      queue.node.play();
    } else {
      queue.node.skip();
    }
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

  public async stopPlaylist(voiceConnection: VoiceBasedChannel) {
    const { guildId } = voiceConnection;

    const queue = await useQueue(guildId);
    await queue?.delete();
  }

  public async skipPlaylist(voiceConnection: VoiceBasedChannel) {
    const { guildId } = voiceConnection;

    const queue = await useQueue(guildId);
    await queue?.node.skip();
  }

  public async getQueue(voiceConnection: VoiceBasedChannel) {
    return await useQueue(voiceConnection.guildId);
  }

  public async createQueue(voiceConnection: VoiceBasedChannel) {
    const player = useMasterPlayer();

    if (!player) {
      throw new Error("Missing player");
    }

    return player?.nodes.create(voiceConnection.guildId, {
      leaveOnEnd: false,
      leaveOnEndCooldown: 60000 * 5,
      leaveOnEmpty: false,
      leaveOnEmptyCooldown: 60000 * 5,
      leaveOnStop: false,
      skipOnNoStream: true,
    });
  }
}
