import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../../queue';
import { Command } from '../command';
import messages from './messages';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'queue';

@injectable()
export default class QueueCommand extends Command {
  #queueService: QueueService;

  constructor(queueService: QueueService) {
    super();
    this.#queueService = queueService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Prints the current queue';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }

    const queue = this.#queueService.getQueue(guildId);
    const songs = queue?.songs;

    if (!songs || songs.length === 0) {
      return this.respond(messages.EMPTY_LIST);
    }

    const songList = songs.map((song) => `- ${song.title}\n`).join('')

    return this.respond(songList);
  }
}
