import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import PlaylistService from '../../playlist/PlaylistService';
import SongService from '../../song/SongService';
import { Command } from '../command';
import commonMessages from '../commonMessages';
import messages from './messages';


const shuffle = require('fisher-yates');
const DIRECTIVE = 'playlist';
const SHUFFLE_DIRECTIVE = 'shuffle';

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
    return `Sets the queue to one of the premades playlists;
    \tExample: *_m playlist <PLAYLIST_NAME>*
    \tYou can also shuffle the playlist if you wish:
    \tExample: *_m playlist <PLAYLIST_NAME> shuffle*
    \t**This will clear the current queue**`;
  }

  async execute(message: Message, args: string[]): Promise<string> {
    if (args.length > 2) {
      return this.respond(commonMessages.UNKNOWN_NUMBER_OF_ARGUMENTS_ERROR);
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      return this.respond(commonMessages.NOT_IN_VOICE_CHANNEL);
    }

    const playlistName = args[0];
    let songs = await this.#playlistService.getPlaylistSongs(playlistName);

    if (this.#shouldShuffle(args)) {
      songs = shuffle(songs);
    }

    await this.#songService.playPlaylistAtChannel(songs, voiceChannel, message);
    return await this.respond(messages.PLAYING_PLAYLIST(playlistName));
  }

  #shouldShuffle(args: string[]) {
    return args.length >= 2 && args[1] == SHUFFLE_DIRECTIVE;
  }
}
