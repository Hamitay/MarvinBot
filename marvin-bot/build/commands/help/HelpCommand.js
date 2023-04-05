"use strict";
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
var _HelpCommand_commandList;
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const commonMessages_1 = __importDefault(require("../commonMessages"));
// Requiring outside root-dir
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require("../../../package.json");
const DIRECTIVE = "help";
class HelpCommand extends command_1.Command {
    constructor(commandList) {
        super();
        _HelpCommand_commandList.set(this, void 0);
        __classPrivateFieldSet(this, _HelpCommand_commandList, commandList, "f");
    }
    getDirective() {
        return DIRECTIVE;
    }
    getHelpMessage() {
        return "Gives all the possible commands. But you probably already know this.";
    }
    getHelpHeader() {
        return "Marvin Bot version: " + pjson.version + "\n";
    }
    buildHelpResponse() {
        const helpMessage = [...__classPrivateFieldGet(this, _HelpCommand_commandList, "f"), this]
            .map((command) => `-> **${command === null || command === void 0 ? void 0 : command.getDirective()}**: ${command === null || command === void 0 ? void 0 : command.getHelpMessage()}`)
            .join("\n\n");
        return this.getHelpHeader() + helpMessage;
    }
    async execute(message) {
        var _a;
        const guildId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!guildId) {
            return this.respond(commonMessages_1.default.NO_GUILD_ID_ERROR);
        }
        return this.respond(this.buildHelpResponse());
    }
}
exports.default = HelpCommand;
_HelpCommand_commandList = new WeakMap();
//# sourceMappingURL=HelpCommand.js.map