"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlaylistNotFoundError_1 = __importDefault(require("../errors/PlaylistNotFoundError"));
const publisher_1 = require("../publisher");
const enum_1 = require("../video/enum");
const PlaylistRepository_1 = __importDefault(require("./PlaylistRepository"));
const getPlaylists = async () => {
    return await PlaylistRepository_1.default.getPlaylists();
};
const createPlaylist = async (name, creatorId) => {
    return await PlaylistRepository_1.default.createPlaylist(name, creatorId);
};
const getPlaylistById = async (id) => {
    const playlist = await PlaylistRepository_1.default.getPlaylistById(id);
    if (!playlist) {
        throw new PlaylistNotFoundError_1.default(id);
    }
    return playlist;
};
const addVideoToPlaylist = async (playlistId, videoName, videoUrl, thumbnailUrl) => {
    // TODO Resolve video path and resolve name colision
    const videoPath = `${'videoFolderPath'}/videoName`;
    const newVideo = await PlaylistRepository_1.default.addVideoToPlaylist(playlistId, videoName, videoUrl, videoPath, enum_1.VIDEO_STATUS.REQUESTED, thumbnailUrl);
    // TODO publish message to download
    await (0, publisher_1.publishMessage)({ videoId: newVideo.id });
    return newVideo;
};
exports.default = {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistById
};
//# sourceMappingURL=PlaylistService.js.map