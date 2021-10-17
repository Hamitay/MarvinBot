import { PrismaClient, Playlist } from '@prisma/client';
import { VIDEO_STATUS } from '../video/enum';

const client = new PrismaClient();

const getPlaylists = async (): Promise<Playlist[]> => {
    return await client.playlist.findMany({
        include: {
            videos: true
        }
    });
}

const createPlaylist = async (name: string, creatorId: number): Promise<Playlist> => {
    return await client.playlist.create({
        data: {
            name,
            creatorId
        }
    })
}

const addVideoToPlaylist = async (playlistId: number,
    videoName: string,
    videoUrl: string,
    path: string,
    status: VIDEO_STATUS,
    thumbnailUrl: string
) => {

    console.log(playlistId, videoName, videoUrl, path, status, thumbnailUrl)
    await client.video.create({
        data: {
            name: videoName,
            thirdPartyUrl: videoUrl,
            url: path,
            status,
            thumbnailUrl,
            playlistId
        }
    })
}

export default {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist
}