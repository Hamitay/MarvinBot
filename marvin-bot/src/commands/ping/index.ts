import {
  CacheType,
  CommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
} from "discord.js";
import { injectable } from "tsyringe";
import { SlashCommand } from "../command";

const commandName = "ping";
const commandDescription = "Replies with ping";

@injectable()
export class PingCommand extends SlashCommand {
  #builder: SlashCommandBuilder;

  constructor() {
    super();
    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): SlashCommandBuilder {
    return this.#builder;
  }

  async execute(
    interaction: CommandInteraction<CacheType>
  ): Promise<InteractionResponse<boolean>> {
    return await interaction.reply("Pong");
  }
}
