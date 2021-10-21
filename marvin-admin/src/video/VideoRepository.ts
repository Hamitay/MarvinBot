import { PrismaClient, Video } from ".prisma/client";
import { VIDEO_STATUS } from "./enum";

const client = new PrismaClient();

const getVideoById = async (videoId: number): Promise<Video | null> => {
    return await client.video.findFirst({where: {
        id: videoId
    }})
}

const updateVideoStatus = async (videoId: number, status: VIDEO_STATUS): Promise<Video | null> => {
    return await client.video.update({
        where: {
            id: videoId
        },
        data: {
            status,
        }
    })
}

export default {
    getVideoById,
    updateVideoStatus
}