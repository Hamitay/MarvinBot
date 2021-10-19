"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = require("body-parser");
const PlaylistService_1 = __importDefault(require("./PlaylistService"));
const PlaylistNotFoundError_1 = __importDefault(require("../errors/PlaylistNotFoundError"));
const playlistController = (0, express_1.Router)();
playlistController.get('/', async (req, res) => {
    const playlists = await PlaylistService_1.default.getPlaylists();
    res.send(playlists);
});
playlistController.post('/', (0, body_parser_1.json)(), async (req, res) => {
    // TODO add payload validation
    const newPlaylistRequest = req.body;
    const { name, creatorId } = newPlaylistRequest;
    try {
        const newPlaylist = await PlaylistService_1.default.createPlaylist(name, creatorId);
        return res.send(newPlaylist);
    }
    catch (error) {
        // TODO better error handling
        console.error(error);
        return res.sendStatus(500);
    }
});
playlistController.get('/:id', (0, body_parser_1.json)(), async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await PlaylistService_1.default.getPlaylistById(parseInt(id));
        return res.send(playlist);
    }
    catch (error) {
        if (error instanceof PlaylistNotFoundError_1.default) {
            return res.sendStatus(404);
        }
        return res.sendStatus(500);
    }
});
playlistController.put('/:id/addVideo', (0, body_parser_1.json)(), async (req, res) => {
    // TODO add payload validation
    const addVideoRequest = req.body;
    const { name, url, thumbnailUrl } = addVideoRequest;
    const { id } = req.params;
    try {
        const video = await PlaylistService_1.default.addVideoToPlaylist(parseInt(id), name, url, thumbnailUrl);
        return res.send(video);
    }
    catch (error) {
        // TODO better error handling
        console.error(error);
        return res.sendStatus(500);
    }
});
exports.default = playlistController;
//# sourceMappingURL=PlaylistController.js.map