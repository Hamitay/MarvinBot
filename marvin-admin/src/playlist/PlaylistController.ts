import { Router } from "express";
import { json } from 'body-parser';
import PlaylistService from "./PlaylistService";
import { NewPlaylistRequest, AddVideoRequest } from "./types";
import PlaylistNotFoundError from "../errors/PlaylistNotFoundError";

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

playlistController.get('/:id', json(), async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await PlaylistService.getPlaylistById(parseInt(id));
        return res.send(playlist);
    } catch (error) {
        if (error instanceof PlaylistNotFoundError) {
            return res.sendStatus(404);
        }

        return res.sendStatus(500);
    }
});

playlistController.put('/:id/addVideo', json(), async (req, res) => {
    // TODO add payload validation
    const addVideoRequest = req.body as AddVideoRequest;
    const { name, url, thumbnailUrl } = addVideoRequest;
    const { id } = req.params

    try {
        const video = await PlaylistService.addVideoToPlaylist(parseInt(id), name, url, thumbnailUrl);
        return res.send(video);
    } catch (error) {
        // TODO better error handling
        console.error(error);
        return res.sendStatus(500);
    }
})




export default playlistController;