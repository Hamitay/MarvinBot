import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import SongService from '../song/SongService';
import { Command } from './command';

const DIRECTIVE = 'play';

@injectable()
export default class PlayCommand implements Command {
  #songService: SongService;

  constructor(songService: SongService) {
    this.#songService = songService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  async execute(messageContext: Message, args: string[]): Promise<string> {
    if (args.length > 1) {
      return this.respond('Wrong number of arguments');
    }

    const voiceChannel = messageContext.member?.voice.channel;

    if (!voiceChannel) {
      return this.respond('Not on a voice channel m8');
    }

    try {
      await this.#songService.playSongAtChannel(args[0], voiceChannel, messageContext);
      return this.respond('Ima playing your shitty songs maiterino');
    } catch(e) {
      console.error(e);
      return this.respond('error adding video to queue error m8')
    }
  }

  public respond(message: string): Promise<string> {
    return new Promise((resolve) => resolve(message));
  }

}
