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
var _QueueService_queueMap;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
let QueueService = class QueueService {
    constructor() {
        _QueueService_queueMap.set(this, void 0);
        __classPrivateFieldSet(this, _QueueService_queueMap, new Map(), "f");
    }
    createQueue(guildId, queueConstruct) {
        __classPrivateFieldGet(this, _QueueService_queueMap, "f").set(guildId, queueConstruct);
    }
    getQueue(guildId) {
        return __classPrivateFieldGet(this, _QueueService_queueMap, "f").get(guildId);
    }
    addSongToQueue(messageContext, songs) {
        var _a, _b;
        const guildId = (_a = messageContext.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!guildId) {
            throw new Error('Guild id not provided');
        }
        const queue = this.getQueue(guildId);
        if (!queue) {
            const queueConstruct = {
                guildId,
                textChannel: messageContext.channel,
                voiceChannel: (_b = messageContext.member) === null || _b === void 0 ? void 0 : _b.voice.channel,
                connection: undefined,
                songs: songs,
                volume: 0.25,
                playing: true,
            };
            this.createQueue(guildId, queueConstruct);
        }
        else {
            songs.forEach((song) => { var _a; return (_a = queue.songs) === null || _a === void 0 ? void 0 : _a.push(song); });
        }
    }
    async connectQueueToChannel(messageContext, voiceChannel) {
        var _a;
        const guildId = (_a = messageContext.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!guildId) {
            throw new Error('Guild id not provided');
        }
        const queue = this.getQueue(guildId);
        if (!queue) {
            throw new Error('Undefined guild');
        }
        queue.connection = await voiceChannel.join();
        return queue;
    }
    async deleteQueue(queue) {
        var _a, _b, _c;
        await ((_b = (_a = queue.connection) === null || _a === void 0 ? void 0 : _a.dispatcher) === null || _b === void 0 ? void 0 : _b.end());
        await ((_c = queue.voiceChannel) === null || _c === void 0 ? void 0 : _c.leave());
        __classPrivateFieldGet(this, _QueueService_queueMap, "f").delete(queue.guildId);
    }
};
_QueueService_queueMap = new WeakMap();
QueueService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], QueueService);
exports.default = QueueService;
//# sourceMappingURL=index.js.map