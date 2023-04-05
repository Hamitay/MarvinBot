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
var _PlayCommand_songService, _PlayCommand_builder, _PlayCommand_logger;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tsyringe_1 = require("tsyringe");
const SongService_1 = __importDefault(require("../../song/SongService"));
const command_1 = require("../command");
const pino_1 = __importDefault(require("pino"));
const commandName = "play";
const commandDescription = "Adds a song from the third party URL to the queue";
let PlayCommand = class PlayCommand extends command_1.SlashCommand {
    constructor(songService) {
        super();
        _PlayCommand_songService.set(this, void 0);
        _PlayCommand_builder.set(this, void 0);
        _PlayCommand_logger.set(this, void 0);
        __classPrivateFieldSet(this, _PlayCommand_logger, (0, pino_1.default)(), "f");
        __classPrivateFieldSet(this, _PlayCommand_songService, songService, "f");
        __classPrivateFieldSet(this, _PlayCommand_builder, new discord_js_1.SlashCommandBuilder()
            .setName(commandName)
            .setDescription(commandDescription)
            .addSubcommand((subcommand) => {
            return subcommand
                .setName("playlist")
                .setDescription("Searches for a playlist in the 3rd party website")
                .addStringOption((option) => {
                return option
                    .setName("url")
                    .setDescription("Playlist Url")
                    .setRequired(true);
            });
        })
            .addSubcommand((subcommand) => {
            return subcommand
                .setName("song")
                .setDescription("Searches for url in the 3rd party website")
                .addStringOption((option) => {
                return option
                    .setName("url")
                    .setDescription("Song url")
                    .setRequired(true);
            });
        }), "f");
    }
    getBuilder() {
        return __classPrivateFieldGet(this, _PlayCommand_builder, "f");
    }
    getName() {
        return commandName;
    }
    async execute(interaction) {
        const { guildId, guild } = interaction;
        if (!guild || !guildId) {
            __classPrivateFieldGet(this, _PlayCommand_logger, "f").error("Missing guild");
            throw new Error("Missing guild id");
        }
        if (!interaction.isChatInputCommand()) {
            __classPrivateFieldGet(this, _PlayCommand_logger, "f").error("Wrong input command");
            throw new Error("Wrong input command");
        }
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();
        const voiceChannel = await super.getVoiceChannel(interaction);
        if (!voiceChannel) {
            await interaction.reply(`${interaction.user}, you need to be in a voice channel for me to play anything!`);
            return;
        }
        if (subcommand === "song") {
            const url = interaction.options.getString("url");
            if (!url) {
                __classPrivateFieldGet(this, _PlayCommand_logger, "f").error("Missing url");
                throw new Error("Missing url param");
            }
            const { track } = await __classPrivateFieldGet(this, _PlayCommand_songService, "f").playSongAtConnection(url, voiceChannel);
            const thumbnail = track.raw.thumbnail;
            const playingEmbed = new discord_js_1.EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(track.title)
                .setURL(track.url)
                .setAuthor({
                name: "Added to queue:",
            })
                .setThumbnail(thumbnail.url)
                .setTimestamp();
            await interaction.followUp({ embeds: [playingEmbed] });
            return;
        }
        if (subcommand === "playlist") {
            const url = interaction.options.getString("url");
            if (!url) {
                __classPrivateFieldGet(this, _PlayCommand_logger, "f").error("Missing url");
                throw new Error("Missing url param");
            }
            const { tracks, playlist } = await __classPrivateFieldGet(this, _PlayCommand_songService, "f").playPlaylistAtConnection(url, voiceChannel);
            const tracksName = tracks.map((t) => `- ${t.title}`).join("\n");
            const playingEmbed = new discord_js_1.EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle((playlist === null || playlist === void 0 ? void 0 : playlist.title) || "Playlist")
                .setURL((playlist === null || playlist === void 0 ? void 0 : playlist.url) || url)
                .setAuthor({
                name: "Added playlist to queue:",
            })
                .setDescription(tracksName)
                .setTimestamp();
            await interaction.followUp({ embeds: [playingEmbed] });
            return;
        }
    }
};
_PlayCommand_songService = new WeakMap(), _PlayCommand_builder = new WeakMap(), _PlayCommand_logger = new WeakMap();
PlayCommand = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [SongService_1.default])
], PlayCommand);
exports.default = PlayCommand;
//# sourceMappingURL=PlayCommand.js.map