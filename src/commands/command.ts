import { Message } from "discord.js";
export abstract class Command {
  abstract getDirective() : string;
  abstract getHelpMessage() : string;
  abstract execute(message: Message, args: string[]) : Promise<string>;

  respond(message: string): Promise<string> {
    return new Promise((resolve) => resolve(message));
  }
}
