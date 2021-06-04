import { Command } from './command';
import SampleCommand from './SampleCommand';


export default class Commands {

  _commandMap: Map<String, Command>

  constructor(sampleCommand: SampleCommand) {
    const commandList = [sampleCommand]
    this._commandMap = this._registerCommands(commandList);
  }

  private _registerCommands(commands: Command[]): Map<String, Command> {
    const map = new Map()
    commands.forEach(command => {
      map.set(command.getDirective(), command);
    })

    return map;
  }

  public executeCommand(commandDirective: String, args: String[]) {
    this._commandMap.get(commandDirective)?.execute(args);
  }
}
