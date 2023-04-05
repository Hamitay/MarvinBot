import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { injectable } from "tsyringe";
import SongService from "../../song/SongService";
import { SlashCommand } from "../command";

import pino, { Logger } from "pino";

const commandName = "play";
const commandDescription = "Adds a song from the third party URL to the queue";

@injectable()
export default class PlayCommand extends SlashCommand {
  #songService: SongService;

  #builder: SlashCommandSubcommandsOnlyBuilder;

  #logger: Logger;

  constructor(songService: SongService) {
    super();
    this.#logger = pino();
    this.#songService = songService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription)
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("playlist")
          .setDescription("Searches for a playlist in the 3rd party website")
          .addStringOption((option) => {
            return option
              .setName("url")
              .setDescription("Playlist Url")
              .setRequired(true);
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName("song")
          .setDescription("Searches for url in the 3rd party website")
          .addStringOption((option) => {
            return option
              .setName("url")
              .setDescription("Song url")
              .setRequired(true);
          });
      });
  }

  getBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return this.#builder;
  }

  getName(): String {
    return commandName;
  }

  async #getVoiceChannel(interaction: CommandInteraction<CacheType>) {
    const { guild, user } = interaction;

    const guildMember = await guild?.members.fetch({ user });

    return guildMember?.voice.channel;
  }

  async execute(interaction: CommandInteraction<CacheType>) {
    const { guildId, guild } = interaction;

    if (!guild || !guildId) {
      this.#logger.error("Missing guild");
      throw new Error("Missing guild id");
    }

    if (!interaction.isChatInputCommand()) {
      this.#logger.error("Wrong input command");
      throw new Error("Wrong input command");
    }

    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    const voiceChannel = await this.#getVoiceChannel(interaction);

    if (!voiceChannel) {
      await interaction.reply(
        `${interaction.user}, you need to be in a voice channel for me to play anything!`
      );
      return;
    }

    if (subcommand === "song") {
      const url = interaction.options.getString("url");

      if (!url) {
        this.#logger.error("Missing url");
        throw new Error("Missing url param");
      }

      const { track } = await this.#songService.playSongAtConnection(
        url,
        voiceChannel
      );

      const thumbnail = track.raw.thumbnail as any;
      const playingEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(track.title)
        .setURL(track.url)
        .setAuthor({
          name: "Added to queue:",
        })
        .setThumbnail(thumbnail.url)
        .setTimestamp();

      await interaction.followUp({ embeds: [playingEmbed] });
      return;
    }

    if (subcommand === "playlist") {
      const url = interaction.options.getString("url");

      if (!url) {
        this.#logger.error("Missing url");
        throw new Error("Missing url param");
      }

      const { tracks, playlist } =
        await this.#songService.playPlaylistAtConnection(url, voiceChannel);

      const tracksName = tracks.map((t) => `- ${t.title}`).join("\n");

      const playingEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(playlist?.title || "Playlist")
        .setURL(playlist?.url || url)
        .setAuthor({
          name: "Added playlist to queue:",
        })
        .setDescription(tracksName)
        .setTimestamp();

      await interaction.followUp({ embeds: [playingEmbed] });
      return;
    }
  }
}
