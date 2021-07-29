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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tsyringe_1 = require("tsyringe");
const token = process.env.DISCORD_TOKEN;
let DiscordClient = class DiscordClient {
    constructor() {
        this._client = new discord_js_1.Client();
    }
    init(messageHandler) {
        this._client.once('ready', () => {
            console.log('Im ready');
        });
        this._client.once('reconnecting', () => {
            console.log('Im trying to reconnect');
        });
        this._client.once('disconnect', () => {
            console.log('Im disconnected');
        });
        // Register commands here
        this._client.on('message', messageHandler);
        return this._client.login(token);
    }
};
DiscordClient = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], DiscordClient);
exports.default = DiscordClient;
//# sourceMappingURL=index.js.map