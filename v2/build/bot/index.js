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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const client_1 = __importDefault(require("../client"));
const commands_1 = __importDefault(require("../commands"));
const alias = '_m';
const prefix = 'marvin';
let MarvinBot = class MarvinBot {
    constructor(commands, discordClient) {
        this._messageHandler = async (message) => {
            const { content } = message;
            if (content.startsWith(alias) || content.startsWith(prefix)) {
                const sanitizedInpute = this.sanitizeInput(content);
                const result = (await this._commands.executeCommand(sanitizedInpute.directive, sanitizedInpute.args, message));
                return message.channel.send(result);
            }
        };
        this._commands = commands;
        this._client = discordClient;
    }
    sanitizeInput(input) {
        const args = input.split(' ')
            .filter((element) => element !== '')
            .splice(1);
        return {
            directive: args[0],
            args: args.splice(1),
        };
    }
    listen() {
        return this._client.init(this._messageHandler);
    }
};
MarvinBot = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [commands_1.default, client_1.default])
], MarvinBot);
exports.default = MarvinBot;
//# sourceMappingURL=index.js.map