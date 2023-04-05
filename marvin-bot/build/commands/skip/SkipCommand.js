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
var _SkipCommand_builder, _SkipCommand_songService, _SkipCommand_logger;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tsyringe_1 = require("tsyringe");
const command_1 = require("../command");
const messages_1 = __importDefault(require("./messages"));
const SongService_1 = __importDefault(require("../../song/SongService"));
const pino_1 = __importDefault(require("pino"));
const commandName = "skip";
const commandDescription = "Skips the current (or more) songs from the queue";
let SkipCommand = class SkipCommand extends command_1.SlashCommand {
    constructor(songService) {
        super();
        _SkipCommand_builder.set(this, void 0);
        _SkipCommand_songService.set(this, void 0);
        _SkipCommand_logger.set(this, void 0);
        __classPrivateFieldSet(this, _SkipCommand_logger, (0, pino_1.default)(), "f");
        __classPrivateFieldSet(this, _SkipCommand_songService, songService, "f");
        __classPrivateFieldSet(this, _SkipCommand_builder, new discord_js_1.SlashCommandBuilder()
            .setName(commandName)
            .setDescription(commandDescription)
            .addIntegerOption((option) => option.setName("quantity").setDescription("How many songs to skip")), "f");
    }
    getName() {
        return commandName;
    }
    getBuilder() {
        return __classPrivateFieldGet(this, _SkipCommand_builder, "f");
    }
    async execute(interaction) {
        const voiceChannel = await super.getVoiceChannel(interaction);
        if (!voiceChannel) {
            return await interaction.followUp(messages_1.default.EMPTY_LIST);
        }
        if (!interaction.isChatInputCommand()) {
            __classPrivateFieldGet(this, _SkipCommand_logger, "f").error("Wrong input command");
            throw new Error("Wrong input command");
        }
        await interaction.deferReply();
        const quantity = interaction.options.getInteger("quantity") || 1;
        await __classPrivateFieldGet(this, _SkipCommand_songService, "f").skipPlaylist(voiceChannel, quantity);
        return await interaction.followUp(messages_1.default.SKIPPING_SONG);
    }
};
_SkipCommand_builder = new WeakMap(), _SkipCommand_songService = new WeakMap(), _SkipCommand_logger = new WeakMap();
SkipCommand = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [SongService_1.default])
], SkipCommand);
exports.default = SkipCommand;
//# sourceMappingURL=SkipCommand.js.map