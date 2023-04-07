import { StringSelectMenuInteraction } from "discord.js";
import { injectable } from "tsyringe";
import { buildDefaultEmbed } from "../../util/embedUtil";
import PlaylistService from "../../playlist/PlaylistService";
import SongService from "../../song/SongService";

export const INTERACTION_SELECTOR = "selectPlaylist";

export default class PlaylistSelectInteraction {
  #playlistService: PlaylistService;
  #songService: SongService;

  constructor(playlistService: PlaylistService, songService: SongService) {
    this.#playlistService = playlistService;
    this.#songService = songService;
  }

  async handleInteraction(interaction: StringSelectMenuInteraction) {
    const selected = interaction.values[0];

    const playlist = await this.#playlistService.getPlaylistByName(selected);

    const videosNames = playlist.videos
      .map((video) => `- ${video.name}`)
      .join("\n");

    const menuEmbed = buildDefaultEmbed(
      "Now playing",
      `The ${selected} playlist was selected`
    ).setDescription(videosNames);

    // Start playing song from playlist
    const { guild, user } = interaction;

    const guildMember = await guild?.members.fetch({ user });

    const voiceChannel = guildMember?.voice.channel;

    if (!voiceChannel) {
      throw Error("voice channel error");
    }

    const songs = playlist.videos.map((video) => video.url);

    await this.#songService.playSongsAtConnection(songs, voiceChannel);
    await interaction.update({ embeds: [menuEmbed] });
  }
}
