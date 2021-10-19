"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const getPlaylists = async () => {
    return await client.playlist.findMany({
        include: {
            videos: {
                select: {
                    id: true
                }
            }
        }
    });
};
const createPlaylist = async (name, creatorId) => {
    return await client.playlist.create({
        data: {
            name,
            creatorId
        }
    });
};
const getPlaylistById = async (playlistId) => {
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
    });
};
const addVideoToPlaylist = async (playlistId, videoName, videoUrl, path, status, thumbnailUrl) => {
    return await client.video.create({
        data: {
            name: videoName,
            thirdPartyUrl: videoUrl,
            url: path,
            status,
            thumbnailUrl,
            playlistId
        }
    });
};
exports.default = {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistById
};
//# sourceMappingURL=PlaylistRepository.js.map