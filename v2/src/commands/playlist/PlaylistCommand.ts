import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import PlaylistService from '../../playlist/PlaylistService';
import QueueService from '../../queue';
import SongService from '../../song/SongService';
import { Command } from '../command';
import commonMessages from '../commonMessages';

const DIRECTIVE = 'playlist';

@injectable()
export default class PlaylistCommand extends Command {
  #playlistService: PlaylistService;
  #songService: SongService;

  constructor(playlistService: PlaylistService, songService: SongService) {
    super();
    this.#playlistService = playlistService;
    this.#songService = songService;
  }

  getDirective(): string {
    return DIRECTIVE;
  }
  getHelpMessage(): string {
    return 'Sets the queue to one of the premades playlists; \n\t **This will clear the current queue**';
  }
  async execute(message: Message, args: string[]): Promise<string> {
    if (args.length > 1) {
      return this.respond(commonMessages.UNKNOWN_NUMBER_OF_ARGUMENTS_ERROR);
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      return this.respond(commonMessages.NOT_IN_VOICE_CHANNEL);
    }

    const playlistName = args[0];
    console.log(args)
    const songs = await this.#playlistService.getPlaylistSongs(playlistName);

    await this.#songService.playPlaylistAtChannel(songs, voiceChannel, message);
    return await this.respond('oi');
  }
}
