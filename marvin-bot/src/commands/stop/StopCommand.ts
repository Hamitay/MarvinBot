import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../../queue';
import { Command } from '../command';
import messages from './messages';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'stop';

@injectable()
export default class StopCommand extends Command {
  #queueService: QueueService;

  constructor(queueService: QueueService) {
    super();
    this.#queueService = queueService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Stops the current song and clears the queue.';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }

    const queue = this.#queueService.getQueue(guildId);
    const songs = queue?.songs;

    if (!songs || songs.length === 0) {
      return this.respond(messages.NO_SONGS_ERRORS);
    }

    this.#queueService.deleteQueueById(guildId);

    return this.respond(messages.STOP_MESSAGE);
  }
}
