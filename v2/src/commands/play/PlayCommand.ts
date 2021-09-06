import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import SongService from '../../song/SongService';
import { Command } from '../command';
import messages from './messages';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'play';

@injectable()
export default class PlayCommand extends Command {
  #songService: SongService;

  constructor(songService: SongService) {
    super();
    this.#songService = songService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Plays a song from a youtube or soundcloud link or puts it at the bottom of the queue.';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    if (args.length > 1) {
      return this.respond(commonMessages.UNKNOWN_NUMBER_OF_ARGUMENTS_ERROR);
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      return this.respond(commonMessages.NOT_IN_VOICE_CHANNEL);
    }

    try {
      const songUrl = args[0];
      const songs = await this.#songService.playSongAtChannel(
        songUrl,
        voiceChannel,
        message
      );
      return this.respond(messages.PLAYING_SONG(songs[0].title));
    } catch (e) {
      return this.respond(messages.ERROR_PLAYING_SONG(e));
    }
  }
}
