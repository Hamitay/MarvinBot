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
var _DiscordClient_client, _DiscordClient_restClient, _DiscordClient_commands, _DiscordClient_logger;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tsyringe_1 = require("tsyringe");
const commands_1 = __importDefault(require("../commands"));
const pino_1 = require("pino");
const PlayerBuilder_1 = require("../song/PlayerBuilder");
const token = process.env.DISCORD_TOKEN;
const applicationId = "729334553306726491";
let DiscordClient = class DiscordClient {
    constructor(commands) {
        _DiscordClient_client.set(this, void 0);
        _DiscordClient_restClient.set(this, void 0);
        _DiscordClient_commands.set(this, void 0);
        _DiscordClient_logger.set(this, void 0);
        this.registerSlashCommands = async () => {
            await __classPrivateFieldGet(this, _DiscordClient_restClient, "f").put(discord_js_1.Routes.applicationCommands(applicationId), {
                body: __classPrivateFieldGet(this, _DiscordClient_commands, "f").commandList.map((command) => command.getBuilder().toJSON()),
            });
        };
        __classPrivateFieldSet(this, _DiscordClient_logger, (0, pino_1.pino)(), "f");
        if (!token) {
            __classPrivateFieldGet(this, _DiscordClient_logger, "f").error("Undefined discord token");
            return;
        }
        __classPrivateFieldSet(this, _DiscordClient_client, new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildVoiceStates],
        }), "f");
        (0, PlayerBuilder_1.buildPlayer)(__classPrivateFieldGet(this, _DiscordClient_client, "f"));
        __classPrivateFieldSet(this, _DiscordClient_commands, commands, "f");
        __classPrivateFieldSet(this, _DiscordClient_restClient, new discord_js_1.REST({ version: "10" }).setToken(token), "f");
    }
    init() {
        __classPrivateFieldGet(this, _DiscordClient_client, "f").once(discord_js_1.Events.ClientReady, (c) => {
            __classPrivateFieldGet(this, _DiscordClient_logger, "f").info("I'm ready and upgraded");
        });
        __classPrivateFieldGet(this, _DiscordClient_client, "f").on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const commandName = interaction.commandName;
            const commmand = __classPrivateFieldGet(this, _DiscordClient_commands, "f").commandMap.get(commandName);
            if (!commmand) {
                __classPrivateFieldGet(this, _DiscordClient_logger, "f").child({ command: commandName });
                __classPrivateFieldGet(this, _DiscordClient_logger, "f").error("Unregistered command");
                interaction.reply("Unexpected error!");
                return;
            }
            try {
                await (commmand === null || commmand === void 0 ? void 0 : commmand.execute(interaction));
            }
            catch (error) {
                __classPrivateFieldGet(this, _DiscordClient_logger, "f").child({ error });
                __classPrivateFieldGet(this, _DiscordClient_logger, "f").error(`Command ${commandName} produce an unexpected error ${error}`);
                interaction.followUp("Unexpected error!");
            }
        });
        __classPrivateFieldGet(this, _DiscordClient_client, "f").login(token);
        this.registerSlashCommands();
    }
};
_DiscordClient_client = new WeakMap(), _DiscordClient_restClient = new WeakMap(), _DiscordClient_commands = new WeakMap(), _DiscordClient_logger = new WeakMap();
DiscordClient = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [commands_1.default])
], DiscordClient);
exports.default = DiscordClient;
//# sourceMappingURL=index.js.map