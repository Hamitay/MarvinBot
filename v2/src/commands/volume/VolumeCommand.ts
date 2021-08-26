import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import QueueService from '../../queue';
import { Command } from '../command';
import messages from './messages';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'volume';

@injectable()
export default class VolumeCommand extends Command {
  #queueService: QueueService;

  constructor(queueService: QueueService) {
    super();
    this.#queueService = queueService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Changes the volume of the stream between 0% and 100%';
  }

  normalizeVolume(volume: number): number {
    const boundedVolume = volume > 100 ? 100 : volume;
    return boundedVolume / 100;
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const guildId = message.guild?.id;

    if (!guildId) {
      return this.respond(commonMessages.NO_GUILD_ID_ERROR);
    }

    const newVolume = this.normalizeVolume(parseInt(args[0]));
    const queue = this.#queueService.getQueue(guildId);
    if (queue) {
      queue.volume = newVolume;
      queue.connection?.dispatcher.setVolume(newVolume);
    }

    return this.respond(messages.VOLUME_UPDATE(newVolume));
  }
}
