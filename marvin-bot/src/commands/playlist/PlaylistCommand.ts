import { injectable } from "tsyringe";
import { InteractionHandler, SlashCommand } from "../command";
import PlaylistService from "../../playlist/PlaylistService";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { buildDefaultEmbed } from "../../util/embedUtil";
import { INTERACTION_SELECTOR } from "../menu/PlaylistSelectInteraction";

const commandName = "playlist";
const commandDescription = "Displays playlist operations";

const playButtonSelector = "playPlaylist";
const createButtonSelector = "createPlaylist";
const editButtonSelector = "editPlaylist";

@injectable()
export default class PlaylistCommand extends SlashCommand {
  #builder: SlashCommandSubcommandsOnlyBuilder;

  #playlistService: PlaylistService;

  #buttonInteractionHandlers: InteractionHandler<ButtonInteraction>[];

  constructor(playlistService: PlaylistService) {
    super();
    this.#playlistService = playlistService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);

    this.#buttonInteractionHandlers = [
      new PlayButtonInteractionHandler(playlistService),
      new CreateButtonInteractionHandler(playlistService),
    ];
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return this.#builder;
  }

  getButtonHandlers(): InteractionHandler<ButtonInteraction>[] {
    return this.#buttonInteractionHandlers;
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    await interaction.deferReply();

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(playButtonSelector)
        .setLabel("Play")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(createButtonSelector)
        .setLabel("Create")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(editButtonSelector)
        .setLabel("Edit")
        .setStyle(ButtonStyle.Secondary)
    );

    const menuEmbed = buildDefaultEmbed(
      "What would you like to do? ",
      "Playlist admin"
    );

    return interaction.followUp({
      embeds: [menuEmbed],
      components: [actionRow],
    });
  }
}

class PlayButtonInteractionHandler extends InteractionHandler<ButtonInteraction> {
  #playlistService: PlaylistService;

  constructor(playlistService: PlaylistService) {
    super();
    this.#playlistService = playlistService;
  }

  getSelector(): String {
    return playButtonSelector;
  }
  async execute(interaction: ButtonInteraction<CacheType>): Promise<any> {
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

class CreateButtonInteractionHandler extends InteractionHandler<ButtonInteraction> {
  #playlistService: PlaylistService;

  constructor(playlistService: PlaylistService) {
    super();
    this.#playlistService = playlistService;
  }

  getSelector(): String {
    return createButtonSelector;
  }
  async execute(interaction: ButtonInteraction<CacheType>): Promise<any> {
    //const playlists = await this.#playlistService.getAllPlaylists();
    const modal = new ModalBuilder()
      .setCustomId("createPlaylistModal")
      .setTitle("Create a new playlist");

    const playlistNameInput = new TextInputBuilder()
      .setCustomId("newPlaylistName")
      .setLabel("Playlist name:")
      .setPlaceholder("Insert name here...")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameInput
      );

    modal.addComponents(actionRow);

    return await interaction.showModal(modal);
  }
}
