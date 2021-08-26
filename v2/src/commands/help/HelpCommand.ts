import { Message } from 'discord.js';
import { Command } from '../command';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'help';

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
    return 'Gives all the possible commands. But you probably already know this.';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }

    const helpMessage = [...this.#commandList, this]
      .map(
        (command) =>
          `-> **${command?.getDirective()}**: ${command?.getHelpMessage()}`
      )
      .join('\n');

    return this.respond(helpMessage);
  }
}
