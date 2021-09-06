import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import { Command } from './command';
import PlayCommand from './play/PlayCommand';
import MenuCommand from './menu/MenuCommand';
import StopCommand from './stop/StopCommand';
import QueueCommand from './queue/QueueCommand';
import VolumeCommand from './volume/VolumeCommand';
import HelpCommand from './help/HelpCommand';
import SkipCommand from './skip/SkipCommand';
import PlaylistCommand from './playlist/PlaylistCommand';
import commonMessages from './commonMessages';
@injectable()
export default class Commands {
  #commandMap: Map<string, Command>;

  constructor(
    playCommand: PlayCommand,
    stopCommand: StopCommand,
    queueCommand: QueueCommand,
    volumeCommand: VolumeCommand,
    menuCommand: MenuCommand,
    skipCommand: SkipCommand,
    playlistCommand: PlaylistCommand
  ) {
    const commandList = [
      playCommand,
      stopCommand,
      queueCommand,
      volumeCommand,
      menuCommand,
      skipCommand,
      playlistCommand,
    ];

    // This explicit declaration is to avoid circular dependencies issues
    const helpCommand = new HelpCommand(commandList);
    this.#commandMap = this.registerCommands([...commandList, helpCommand]);
  }

  private registerCommands(commands: Command[]): Map<string, Command> {
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
    const command = this.#commandMap.get(commandDirective);

    if (command) {
      return command.execute(message, args);
    }

    return new Promise((resolve) =>
      resolve(commonMessages.ASK_FOR_HELP_MESSAGE)
    );
  }
}
