import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../../queue';
import { Command } from '../command';
import commonMessages from '../commonMessages';
import messages from './messages';

const DIRECTIVE = 'skip';

@injectable()
export default class SkipCommand extends Command {
  #queueService: QueueService;

  constructor(queueService: QueueService) {
    super();
    this.#queueService = queueService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Skips the current song and plays the next one on the queue.';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }
    const queue = this.#queueService.getQueue(guildId);

    if (!queue) {
      return this.respond(messages.EMPTY_LIST);
    }

    queue.connection?.dispatcher.end();
    return this.respond(messages.SKIPPING_SONG);
  }
}
