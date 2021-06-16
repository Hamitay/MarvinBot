import { Message } from "discord.js";
export interface Command {
  getDirective() : string;
  execute(message: Message, args: string[]) : Promise<string>;
}
