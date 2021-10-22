import { Message } from "discord.js";
import { Command } from "../command";
import commonMessages from "../commonMessages";

// Requiring outside root-dir
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require("../../../package.json");

const DIRECTIVE = "help";

export default class HelpCommand extends Command {
  #commandList: Command[];

  constructor(commandList: Command[]) {
    super();
    this.#commandList = commandList;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return "Gives all the possible commands. But you probably already know this.";
  }

  getHelpHeader(): string {
    return "Marvin Bot version: " + pjson.version + "\n";
  }

  buildHelpResponse(): string {
    const helpMessage = [...this.#commandList, this]
      .map(
        (command) =>
          `-> **${command?.getDirective()}**: ${command?.getHelpMessage()}`
      )
      .join("\n\n");

    return this.getHelpHeader() + helpMessage;
  }

  async execute(message: Message): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }

    return this.respond(this.buildHelpResponse());
  }
}
