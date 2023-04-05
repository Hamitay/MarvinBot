"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const command_1 = require("../command");
const commonMessages_1 = __importDefault(require("../commonMessages"));
const messages_1 = __importDefault(require("./messages"));
const DIRECTIVE = "bind";
let BindCommand = class BindCommand extends command_1.Command {
    getDirective() {
        return DIRECTIVE;
    }
    getHelpMessage() {
        return "Returns the chat id for hackerman purposes.";
    }
    async execute(message) {
        var _a;
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!voiceChannel) {
            return this.respond(commonMessages_1.default.NOT_IN_VOICE_CHANNEL);
        }
        await voiceChannel.join();
        return this.respond(messages_1.default.BIND_ID(message.channel.id));
    }
};
BindCommand = __decorate([
    (0, tsyringe_1.injectable)()
], BindCommand);
exports.default = BindCommand;
//# sourceMappingURL=BindCommand.js.map