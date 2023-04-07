import { injectable } from "tsyringe";
import { InteractionHandler, SlashCommand } from "../command";
import PlaylistService from "../../playlist/PlaylistService";
import {
  ActionRowBuilder,
  CacheType,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { buildDefaultEmbed } from "../../util/embedUtil";
import SongService from "../../song/SongService";
import { INTERACTION_SELECTOR } from "./PlaylistSelectInteraction";

const commandName = "menu";
const commandDescription = "Displays the available playlists";

@injectable()
export default class MenuCommand extends SlashCommand {
  #builder: SlashCommandSubcommandsOnlyBuilder;

  #playlistService: PlaylistService;

  #stringSelectHandlers: InteractionHandler<StringSelectMenuInteraction>[];

  constructor(playlistService: PlaylistService, songService: SongService) {
    super();
    this.#playlistService = playlistService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);

    this.#stringSelectHandlers = [
      new PlaylistSelectInteraction(playlistService, songService),
    ];
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return this.#builder;
  }

  getStringSelectHandlers(): InteractionHandler<StringSelectMenuInteraction>[] {
    return this.#stringSelectHandlers;
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    await interaction.deferReply();

    const playlists = await this.#playlistService.getAllPlaylists();

    const options = playlists.map((playlist) => ({
      label: playlist.name,
      value: playlist.name,
    }));

    const actionRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(INTERACTION_SELECTOR)
          .setPlaceholder("No playlist selected")
          .addOptions(...options)
      );

    const menuEmbed = buildDefaultEmbed(
      "Choose your playlist:",
      "Le Marvin Menu"
    );

    return interaction.followUp({
      embeds: [menuEmbed],
      components: [actionRow],
    });
  }
}

export class PlaylistSelectInteraction extends InteractionHandler<StringSelectMenuInteraction> {
  #playlistService: PlaylistService;
  #songService: SongService;

  constructor(playlistService: PlaylistService, songService: SongService) {
    super();
    this.#playlistService = playlistService;
    this.#songService = songService;
  }

  getSelector(): String {
    return INTERACTION_SELECTOR;
  }

  async execute(interaction: StringSelectMenuInteraction): Promise<any> {
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
    await interaction.update({ embeds: [menuEmbed], components: [] });
  }
}
