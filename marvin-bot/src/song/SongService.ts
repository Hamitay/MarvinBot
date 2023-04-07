import { VoiceBasedChannel } from "discord.js";
import { singleton } from "tsyringe";
import { QueryType, Track, useMasterPlayer, useQueue } from "discord-player";

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

    const tracks = songUrls.map(async (url) => {
      const result = await player.search(url, {
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.hasTracks()) {
        return result.tracks[0];
      }
    });

    Promise.all(tracks).then(async (values) => {
      const filteredTracks = values.filter((t) => t !== undefined) as Track[];

      //Have to create a playlist since discord-player is odd to say the least
      const playlist = await player.createPlaylist({
        tracks: filteredTracks,
        title: "createdPlaylist",
        description: "createdPlaylist",
        thumbnail: "",
        type: "playlist",
        source: "youtube",
        author: {
          name: "createdAuthor",
          url: ".",
        },
        id: "createdPlaylistId",
        url: "createdPlaylistUrl",
      });

      await player.play(voiceConnection, playlist);
    });
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

  public async skipPlaylist(
    voiceConnection: VoiceBasedChannel,
    toSkip: number = 1
  ) {
    const { guildId } = voiceConnection;

    const queue = await useQueue(guildId);

    for (let i = 0; i < toSkip; i++) {
      await queue?.node.skip();
    }
  }

  public async getQueue(voiceConnection: VoiceBasedChannel) {
    return await useQueue(voiceConnection.guildId);
  }
}
