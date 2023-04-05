import {
  CommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
export abstract class Command {
  abstract getDirective(): string;
  abstract getHelpMessage(): string;
  abstract execute(message: Message, args: string[]): Promise<string>;

  respond(message: string): Promise<string> {
    return new Promise((resolve) => resolve(message));
  }
}

export abstract class SlashCommand {
  abstract getBuilder():
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;

  abstract getName(): String;

  abstract execute(interaction: CommandInteraction): Promise<any>;
}
