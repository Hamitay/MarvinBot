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
var _PlayCommand_songService;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const SongService_1 = __importDefault(require("../song/SongService"));
const DIRECTIVE = 'play';
let PlayCommand = class PlayCommand {
    constructor(songService) {
        _PlayCommand_songService.set(this, void 0);
        __classPrivateFieldSet(this, _PlayCommand_songService, songService, "f");
    }
    getDirective() {
        return DIRECTIVE;
    }
    async execute(messageContext, args) {
        var _a;
        if (args.length > 1) {
            return this.respond('Wrong number of arguments');
        }
        const voiceChannel = (_a = messageContext.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel) {
            return this.respond('Not on a voice channel m8');
        }
        try {
            await __classPrivateFieldGet(this, _PlayCommand_songService, "f").playSongAtChannel(args[0], voiceChannel, messageContext);
            return this.respond('Ima playing your shitty songs maiterino');
        }
        catch (e) {
            console.error(e);
            return this.respond('error adding video to queue error m8');
        }
    }
    respond(message) {
        return new Promise((resolve) => resolve(message));
    }
};
_PlayCommand_songService = new WeakMap();
PlayCommand = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [SongService_1.default])
], PlayCommand);
exports.default = PlayCommand;
//# sourceMappingURL=PlayCommand.js.map