import { Playlist } from ".prisma/client";
import PlaylistRepository from './PlaylistRepository';

const getPlaylists = async (): Promise<Playlist[]> => {
    return await PlaylistRepository.getPlaylists();
}

const createPlaylist = async(name: string, creatorId: number): Promise<Playlist> => {
    return await PlaylistRepository.createPlaylist(name, creatorId);
}

export default {
    getPlaylists,
    createPlaylist
}