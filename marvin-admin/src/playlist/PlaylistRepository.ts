import { PrismaClient, Playlist } from '@prisma/client';

const client = new PrismaClient();

const getPlaylists = async (): Promise<Playlist[]> => {
    return await client.playlist.findMany();
}

const createPlaylist = async (name: string, creatorId: number): Promise<Playlist> => {
    return await client.playlist.create({
        data: {
            name,
            creatorId
        }
    })
}

export default {
    getPlaylists,
    createPlaylist
}