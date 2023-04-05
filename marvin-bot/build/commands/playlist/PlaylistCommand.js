"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _PlaylistCommand_instances, _PlaylistCommand_playlistService, _PlaylistCommand_songService, _PlaylistCommand_shouldLoop, _PlaylistCommand_shouldShuffle;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const PlaylistService_1 = __importDefault(require("../../playlist/PlaylistService"));
const SongService_1 = __importDefault(require("../../song/SongService"));
const command_1 = require("../command");
const commonMessages_1 = __importDefault(require("../commonMessages"));
const messages_1 = __importDefault(require("./messages"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shuffle = require("fisher-yates");
const DIRECTIVE = "playlist";
const SHUFFLE_DIRECTIVE = "shuffle";
const LOOP_DIRECTIVE = "loop";
let PlaylistCommand = class PlaylistCommand extends command_1.Command {
    constructor(playlistService, songService) {
        super();
        _PlaylistCommand_instances.add(this);
        _PlaylistCommand_playlistService.set(this, void 0);
        _PlaylistCommand_songService.set(this, void 0);
        __classPrivateFieldSet(this, _PlaylistCommand_playlistService, playlistService, "f");
        __classPrivateFieldSet(this, _PlaylistCommand_songService, songService, "f");
    }
    getDirective() {
        return DIRECTIVE;
    }
    getHelpMessage() {
        return `Sets the queue to one of the premades playlists;
    \tExample: *_m playlist <PLAYLIST_NAME>*
    \tYou can also shuffle the playlist if you wish:
    \tExample: *_m playlist <PLAYLIST_NAME> shuffle*
    \t**This will clear the current queue**`;
    }
    async execute(message, args) {
        var _a;
        if (args.length > 2) {
            return this.respond(commonMessages_1.default.UNKNOWN_NUMBER_OF_ARGUMENTS_ERROR);
        }
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel) {
            return this.respond(commonMessages_1.default.NOT_IN_VOICE_CHANNEL);
        }
        const playlistName = args[0];
        let songs = [];
        try {
            songs = await __classPrivateFieldGet(this, _PlaylistCommand_playlistService, "f").getPlaylistSongs(playlistName);
        }
        catch (error) {
            console.error(error);
            return await this.respond(`Error playing unknown playlist ${playlistName}`);
        }
        if (__classPrivateFieldGet(this, _PlaylistCommand_instances, "m", _PlaylistCommand_shouldShuffle).call(this, args)) {
            songs = shuffle(songs);
        }
        const loop = __classPrivateFieldGet(this, _PlaylistCommand_instances, "m", _PlaylistCommand_shouldLoop).call(this, args);
        await __classPrivateFieldGet(this, _PlaylistCommand_songService, "f").playPlaylistAtChannel(songs, voiceChannel, message, loop);
        return await this.respond(messages_1.default.PLAYING_PLAYLIST(playlistName));
    }
};
_PlaylistCommand_playlistService = new WeakMap(), _PlaylistCommand_songService = new WeakMap(), _PlaylistCommand_instances = new WeakSet(), _PlaylistCommand_shouldLoop = function _PlaylistCommand_shouldLoop(args) {
    return args.length >= 2 && !!args.find((d) => d === LOOP_DIRECTIVE);
}, _PlaylistCommand_shouldShuffle = function _PlaylistCommand_shouldShuffle(args) {
    return args.length >= 2 && !!args.find((d) => d === SHUFFLE_DIRECTIVE);
};
PlaylistCommand = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof PlaylistService_1.default !== "undefined" && PlaylistService_1.default) === "function" ? _a : Object, SongService_1.default])
], PlaylistCommand);
exports.default = PlaylistCommand;
//# sourceMappingURL=PlaylistCommand.js.map