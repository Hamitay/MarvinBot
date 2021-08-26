"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytpl_1 = __importDefault(require("ytpl"));
const ytdl_core_1 = __importStar(require("ytdl-core"));
const tsyringe_1 = require("tsyringe");
const YT_PLAYLIST_URL = '/playlist?list=';
let YoutubeService = class YoutubeService {
    async getSongInfo(url) {
        if (this.isPlaylist(url)) {
            return await this.getPlaylistInfo(url);
        }
        else {
            return [await this.getSingleVideoInfo(url)];
        }
    }
    isPlaylist(url) {
        return url.includes(YT_PLAYLIST_URL);
    }
    async getPlaylistInfo(url) {
        const playlistInfo = await ytpl_1.default(url);
        const songs = playlistInfo.items.map((item) => ({
            title: item.title,
            url: item.url,
        }));
        return songs;
    }
    async getSingleVideoInfo(url) {
        var _a;
        const videoInfo = await ytdl_core_1.getInfo(url);
        return {
            url: url,
            title: (_a = videoInfo.videoDetails) === null || _a === void 0 ? void 0 : _a.title,
        };
    }
    async getVideoStream(url) {
        return await ytdl_core_1.default(url);
    }
};
YoutubeService = __decorate([
    tsyringe_1.injectable()
], YoutubeService);
exports.default = YoutubeService;
//# sourceMappingURL=YoutubeService.js.map