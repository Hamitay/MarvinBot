import { Router } from "express";
import { json } from 'body-parser';
import PlaylistService from "./PlaylistService";
import { NewPlaylistRequest, AddVideoRequest } from "./types";

const playlistController = Router();

playlistController.get('/', async (req, res) => {
    const playlists = await PlaylistService.getPlaylists();
    res.send(playlists);
});

playlistController.post('/', json(), async (req, res) => {
    // TODO add payload validation
    const newPlaylistRequest = req.body as NewPlaylistRequest;
    const { name, creatorId } = newPlaylistRequest;
    try {
        const newPlaylist = await PlaylistService.createPlaylist(name, creatorId);
        return res.send(newPlaylist);
    } catch (error) {
        // TODO better error handling
        console.error(error);
        return res.sendStatus(500);
    }
});

playlistController.put('/:id/addVideo', json(), async (req, res) => {
    // TODO add payload validation
    const addVideoRequest = req.body as AddVideoRequest;
    const { name, url, thumbnailUrl } = addVideoRequest;
    const { id } = req.params

    try {
        await PlaylistService.addVideoToPlaylist(parseInt(id), name, url, thumbnailUrl);
    } catch (error) {
        // TODO better error handling
        console.error(error);
        return res.sendStatus(500);
    }

    return res.sendStatus(201);
})

export default playlistController;