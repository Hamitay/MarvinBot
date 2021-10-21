import { Video } from "@prisma/client";
import VideoNotFoundError from "../errors/VideoNotFoundError";
import { VIDEO_STATUS } from "./enum";
import VideoRepository from "./VideoRepository";

const getVideoById = async (videoId: number): Promise<Video> =>  {
    const video = await VideoRepository.getVideoById(videoId);

    if (!video) {
        throw new VideoNotFoundError(videoId)
    }

    return video;
}

const updateVideoStatus = async (videoId: number, status: VIDEO_STATUS): Promise<void> => {
    try {
        await VideoRepository.updateVideoStatus(videoId, status);
    } catch(error) {
        console.error('error')
    }
}

export default {
    getVideoById,
    updateVideoStatus
}