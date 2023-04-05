import {
  CacheType,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { injectable } from "tsyringe";
import { SlashCommand } from "../command";
import SongService from "../../song/SongService";
import messages from "./messages";

const commandName = "stop";
const commandDescription = "Stops the current song and purges the queue";

@injectable()
export default class StopCommand extends SlashCommand {
  #builder: SlashCommandSubcommandsOnlyBuilder;

  #songService: SongService;

  constructor(songService: SongService) {
    super();

    this.#songService = songService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return this.#builder;
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    const voiceChannel = await super.getVoiceChannel(interaction);

    if (!voiceChannel) {
      return await interaction.followUp(messages.NO_SONGS_ERRORS);
    }

    await interaction.deferReply();

    await this.#songService.stopPlaylist(voiceChannel);

    return await interaction.followUp(messages.STOP_MESSAGE);
  }
}
