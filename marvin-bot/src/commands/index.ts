import { injectable } from "tsyringe";
import { SlashCommand } from "./command";
import { PingCommand } from "./ping";
import PlayCommand from "./play/PlayCommand";

@injectable()
export default class Commands {
  commandList: SlashCommand[];
  commandMap: Map<string, SlashCommand>;

  constructor(pingCommand: PingCommand, playCommand: PlayCommand) {
    this.commandList = [pingCommand, playCommand];
    this.commandMap = this.buildCommandMap(this.commandList);
  }

  private buildCommandMap(commands: SlashCommand[]): Map<string, SlashCommand> {
    const map = new Map();
    commands.forEach((command) => {
      map.set(command.getName(), command);
    });

    return map;
  }
}
