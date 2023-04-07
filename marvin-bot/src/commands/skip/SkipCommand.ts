import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { injectable } from "tsyringe";
import { SlashCommand } from "../command";
import messages from "./messages";
import SongService from "../../song/SongService";
import pino, { Logger } from "pino";

const commandName = "skip";
const commandDescription = "Skips the current (or more) songs from the queue";

@injectable()
export default class SkipCommand extends SlashCommand {
  #builder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  #songService: SongService;

  #logger: Logger;

  constructor(songService: SongService) {
    super();
    this.#logger = pino();
    this.#songService = songService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  > {
    return this.#builder;
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    const voiceChannel = await super.getVoiceChannel(interaction);

    if (!voiceChannel) {
      return await interaction.followUp(messages.EMPTY_LIST);
    }

    if (!interaction.isChatInputCommand()) {
      this.#logger.error("Wrong input command");
      throw new Error("Wrong input command");
    }

    await interaction.deferReply();

    await this.#songService.skipPlaylist(voiceChannel);

    return await interaction.followUp(messages.SKIPPING_SONG);
  }
}
