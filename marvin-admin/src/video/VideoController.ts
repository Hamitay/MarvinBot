import { Router } from "express";
import VideoNotFoundError from "../errors/VideoNotFoundError";
import VideoService from "./VideoService";

const videoController = Router();

videoController.put('/:id', async (req, res) => {
    const { id } = req.params;

    const videoId = parseInt(id);

    try {
        const video = await VideoService.redownloadVideo(videoId);
        return res.send(video);
    } catch (error) {
        console.error(error);
        if (error instanceof VideoNotFoundError) {
            return res.sendStatus(404);
        }

        return res.sendStatus(500);
    }
})

export default videoController;