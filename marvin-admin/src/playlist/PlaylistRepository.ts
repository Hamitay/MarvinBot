import { PrismaClient, Playlist, Video } from '@prisma/client';
import { VIDEO_STATUS } from '../video/enum';

const client = new PrismaClient();

const getPlaylists = async (): Promise<Playlist[]> => {
    return await client.playlist.findMany({
        include: {
            videos: {
                select: {
                    id: true
                }
            }
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

const getPlaylistById = async (playlistId: number): Promise<Playlist | null> => {
    return await client.playlist.findFirst({
        where: {
            id: playlistId,
        },
        include: {
            videos: {
                select: {
                    name: true,
                    thirdPartyUrl: true,
                    thumbnailUrl: true,
                    status: true,
                    id: true,
                }
            },
            creator: {
                select: {
                    name: true,
                    admin: true,
                }
            },
        }
    })
}

const addVideoToPlaylist = async (playlistId: number,
    videoName: string,
    videoUrl: string,
    path: string,
    status: VIDEO_STATUS,
    thumbnailUrl: string
): Promise<Video> => {
    return await client.video.create({
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
    addVideoToPlaylist,
    getPlaylistById
}