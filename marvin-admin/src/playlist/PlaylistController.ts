import { Router } from "express";
import { json } from 'body-parser';
import PlaylistService from "./PlaylistService";
import { NewPlaylistRequest } from "./types";

const playlistController = Router();

playlistController.get('/', async (req, res) => {
    const playlists = await PlaylistService.getPlaylists();
    res.send(playlists);
});

playlistController.post('/', json(), async (req, res) => {
    // TODO add payload validation
    const newPlaylistRequest = req.body as NewPlaylistRequest;
    const { name, creatorId } = newPlaylistRequest;

    const newPlaylist = await PlaylistService.createPlaylist(name, creatorId);

    res.send(newPlaylist);
});

export default playlistController;