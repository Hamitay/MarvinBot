import { injectable } from "tsyringe";
import { InteractionHandler, SlashCommand } from "./command";
import PlayCommand from "./play/PlayCommand";
import StopCommand from "./stop/StopCommand";
import SkipCommand from "./skip/SkipCommand";
import QueueCommand from "./queue/QueueCommand";
import MenuCommand from "./menu/MenuCommand";
import PlaylistCommand from "./playlist/PlaylistCommand";
import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";

@injectable()
export default class Commands {
  commandList: SlashCommand[];
  commandMap: Map<string, SlashCommand>;
  buttonHandlers: Map<string, InteractionHandler<ButtonInteraction>>;
  stringSelectHandlers: Map<
    string,
    InteractionHandler<StringSelectMenuInteraction>
  >;

  constructor(
    playCommand: PlayCommand,
    stopCommand: StopCommand,
    skipCommand: SkipCommand,
    queueCommand: QueueCommand,
    menuCommand: MenuCommand
  ) {
    this.commandList = [
      playCommand,
      stopCommand,
      skipCommand,
      queueCommand,
      menuCommand,
    ];
    const { commandMap, buttonHandlerMap, stringSelectHandlerMap } =
      this.buildMaps(this.commandList);

    this.commandMap = commandMap;
    this.buttonHandlers = buttonHandlerMap;
    this.stringSelectHandlers = stringSelectHandlerMap;
  }

  private buildMaps(commands: SlashCommand[]) {
    const commandMap = new Map();
    const buttonHandlerMap = new Map();
    const stringSelectHandlerMap = new Map();

    commands.forEach((command) => {
      if (commandMap.get(command.getName())) {
        throw new Error(`Command name collision: ${command.getName()}`);
      }

      commandMap.set(command.getName(), command);

      command.getButtonHandlers().forEach((buttonHandler) => {
        if (buttonHandlerMap.get(buttonHandler.getSelector())) {
          throw new Error(
            `Button handler selector collision: ${buttonHandler.getSelector()}`
          );
        }
        buttonHandlerMap.set(buttonHandler.getSelector(), buttonHandler);
      });

      command.getStringSelectHandlers().forEach((stringSelectHandler) => {
        if (stringSelectHandlerMap.get(stringSelectHandler.getSelector())) {
          throw new Error(
            `String select handler selector collision: ${stringSelectHandler.getSelector()}`
          );
        }
        stringSelectHandlerMap.set(
          stringSelectHandler.getSelector(),
          stringSelectHandler
        );
      });
    });

    return {
      commandMap,
      buttonHandlerMap,
      stringSelectHandlerMap,
    };
  }
}
