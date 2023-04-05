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
var _QueueCommand_builder, _QueueCommand_songService;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const messages_1 = __importDefault(require("./messages"));
const commonMessages_1 = __importDefault(require("../commonMessages"));
const command_1 = require("../command");
const discord_js_1 = require("discord.js");
const SongService_1 = __importDefault(require("../../song/SongService"));
const commandName = "queue";
const commandDescription = "Prints the current queue";
let QueueCommand = class QueueCommand extends command_1.SlashCommand {
    constructor(songService) {
        super();
        _QueueCommand_builder.set(this, void 0);
        _QueueCommand_songService.set(this, void 0);
        __classPrivateFieldSet(this, _QueueCommand_songService, songService, "f");
        __classPrivateFieldSet(this, _QueueCommand_builder, new discord_js_1.SlashCommandBuilder()
            .setName(commandName)
            .setDescription(commandDescription), "f");
    }
    getName() {
        return commandName;
    }
    getBuilder() {
        return __classPrivateFieldGet(this, _QueueCommand_builder, "f");
    }
    async execute(interaction) {
        var _a;
        const voiceChannel = await super.getVoiceChannel(interaction);
        if (!voiceChannel) {
            return await interaction.followUp(commonMessages_1.default.NOT_IN_VOICE_CHANNEL);
        }
        await interaction.deferReply();
        const queue = await __classPrivateFieldGet(this, _QueueCommand_songService, "f").getQueue(voiceChannel);
        if (!queue) {
            return await interaction.followUp(messages_1.default.EMPTY_LIST);
        }
        const currentTrackName = `- **${(_a = queue.currentTrack) === null || _a === void 0 ? void 0 : _a.title}**`;
        const queuedTrackNames = queue.tracks.map((track) => {
            `- ${track.title}`;
        });
        const trackNames = [currentTrackName, ...queuedTrackNames]
            .join("\n")
            .slice(0, 4095);
        const queueEmbed = new discord_js_1.EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Current queue")
            .setAuthor({
            name: "The queue has the following songs",
        })
            .setDescription(trackNames)
            .setTimestamp();
        return await interaction.followUp({ embeds: [queueEmbed] });
    }
};
_QueueCommand_builder = new WeakMap(), _QueueCommand_songService = new WeakMap();
QueueCommand = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [SongService_1.default])
], QueueCommand);
exports.default = QueueCommand;
//# sourceMappingURL=QueueCommand.js.map