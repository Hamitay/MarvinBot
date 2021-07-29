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
var _SongService_youtubeService, _SongService_queueService;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const queue_1 = __importDefault(require("../queue"));
const YoutubeService_1 = __importDefault(require("../thirdParty/YoutubeService"));
let SongService = class SongService {
    constructor(youtubeService, queueService) {
        _SongService_youtubeService.set(this, void 0);
        _SongService_queueService.set(this, void 0);
        __classPrivateFieldSet(this, _SongService_youtubeService, youtubeService, "f");
        __classPrivateFieldSet(this, _SongService_queueService, queueService, "f");
    }
    async getSongInfo(url) {
        return await __classPrivateFieldGet(this, _SongService_youtubeService, "f").getSongInfo(url);
    }
    async playSongAtChannel(songUrl, voiceChannel, messageContext) {
        const songs = await this.getSongInfo(songUrl);
        __classPrivateFieldGet(this, _SongService_queueService, "f").addSongToQueue(messageContext, songs);
        const queue = await __classPrivateFieldGet(this, _SongService_queueService, "f").connectQueueToChannel(messageContext, voiceChannel);
        this.execute(queue);
        return songs;
    }
    async execute(queue) {
        var _a;
        const songs = queue.songs;
        if (!songs || songs.length === 0) {
            __classPrivateFieldGet(this, _SongService_queueService, "f").deleteQueue(queue);
            return;
        }
        const stream = await this.getSongStream(songs[0].url);
        const dispatcher = (_a = queue.connection) === null || _a === void 0 ? void 0 : _a.play(stream, { type: 'unknown' }).on('finish', () => {
            var _a;
            (_a = queue.songs) === null || _a === void 0 ? void 0 : _a.shift();
            this.execute(queue);
        }).on('error', (err) => {
            console.error(err);
            __classPrivateFieldGet(this, _SongService_queueService, "f").deleteQueue(queue);
        });
        dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.setVolume(queue.volume);
    }
    async getSongStream(url) {
        return await __classPrivateFieldGet(this, _SongService_youtubeService, "f").getVideoStream(url);
    }
};
_SongService_youtubeService = new WeakMap(), _SongService_queueService = new WeakMap();
SongService = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [YoutubeService_1.default, queue_1.default])
], SongService);
exports.default = SongService;
//# sourceMappingURL=SongService.js.map