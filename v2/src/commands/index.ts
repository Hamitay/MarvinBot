import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import { Command } from './command';
import PlayCommand from './play/PlayCommand';
import StopCommand from './stop/StopCommand';
import QueueCommand from './queue/QueueCommand';
import commonMessages from './commonMessages';
@injectable()
export default class Commands {
  _commandMap: Map<string, Command>;

  constructor(
    playCommand: PlayCommand,
    stopCommand: StopCommand,
    queueCommand: QueueCommand
  ) {
    const commandList = [playCommand, stopCommand, queueCommand];
    this._commandMap = this._registerCommands(commandList);
  }

  private _registerCommands(commands: Command[]): Map<string, Command> {
    const map = new Map();
    commands.forEach((command) => {
      map.set(command.getDirective(), command);
    });

    return map;
  }

  public executeCommand(
    commandDirective: string,
    args: string[],
    message: Message
  ): Promise<string> {
    const command = this._commandMap.get(commandDirective);

    if (command) {
      return command.execute(message, args);
    }

    return new Promise((resolve) =>
      resolve(commonMessages.ASK_FOR_HELP_MESSAGE)
    );
  }
}
