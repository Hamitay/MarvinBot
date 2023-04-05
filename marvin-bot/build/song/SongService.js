"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const discord_player_1 = require("discord-player");
let SongService = class SongService {
    async playSongAtConnection(songUrl, voiceConnection) {
        const player = (0, discord_player_1.useMasterPlayer)();
        if (!player) {
            throw new Error("Player not initialized!");
        }
        const result = await player.search(songUrl, {
            searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO,
        });
        if (result.isEmpty()) {
            throw new Error("Invalid video");
        }
        return await player.play(voiceConnection, result);
    }
    async playPlaylistAtConnection(playlistUrl, voiceConnection) {
        const player = (0, discord_player_1.useMasterPlayer)();
        if (!player) {
            throw new Error("Player not initialized!");
        }
        const result = await player.search(playlistUrl, {
            searchEngine: discord_player_1.QueryType.YOUTUBE_PLAYLIST,
        });
        if (result.isEmpty() || !result.hasPlaylist()) {
            throw new Error("Invalid playlist");
        }
        const { playlist, tracks } = result;
        const { queue } = await player.play(voiceConnection, result);
        queue.clear;
        return { tracks, queue, playlist };
    }
    async stopPlaylist(voiceConnection) {
        const { guildId } = voiceConnection;
        const queue = await (0, discord_player_1.useQueue)(guildId);
        await (queue === null || queue === void 0 ? void 0 : queue.delete());
    }
    async skipPlaylist(voiceConnection, toSkip = 1) {
        var _a;
        const { guildId } = voiceConnection;
        const queue = await (0, discord_player_1.useQueue)(guildId);
        for (let i = 0; i < toSkip; i++) {
            await ((_a = queue === null || queue === void 0 ? void 0 : queue.dispatcher) === null || _a === void 0 ? void 0 : _a.end());
        }
    }
    async getQueue(voiceConnection) {
        return await (0, discord_player_1.useQueue)(voiceConnection.guildId);
    }
};
SongService = __decorate([
    (0, tsyringe_1.singleton)()
], SongService);
exports.default = SongService;
//# sourceMappingURL=SongService.js.map