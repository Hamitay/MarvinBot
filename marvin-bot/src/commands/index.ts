import { injectable } from "tsyringe";
import { SlashCommand } from "./command";
import PlayCommand from "./play/PlayCommand";
import StopCommand from "./stop/StopCommand";
import SkipCommand from "./skip/SkipCommand";
import QueueCommand from "./queue/QueueCommand";

@injectable()
export default class Commands {
  commandList: SlashCommand[];
  commandMap: Map<string, SlashCommand>;

  constructor(
    playCommand: PlayCommand,
    stopCommand: StopCommand,
    skipCommand: SkipCommand,
    queueCommand: QueueCommand
  ) {
    this.commandList = [playCommand, stopCommand, skipCommand, queueCommand];
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
