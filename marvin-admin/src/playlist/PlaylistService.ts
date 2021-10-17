import { Playlist } from ".prisma/client";
import { VIDEO_STATUS } from "../video/enum";
import PlaylistRepository from './PlaylistRepository';

const getPlaylists = async (): Promise<Playlist[]> => {
    return await PlaylistRepository.getPlaylists();
}

const createPlaylist = async (name: string, creatorId: number): Promise<Playlist> => {
    return await PlaylistRepository.createPlaylist(name, creatorId);
}

const addVideoToPlaylist = async (playlistId: number, videoName: string, videoUrl: string, thumbnailUrl: string) => {
    // TODO Resolve video path and resolve name colision
    const videoPath = `${'videoFolderPath'}/videoName`;

    await PlaylistRepository.addVideoToPlaylist(playlistId, videoName, videoUrl, videoPath, VIDEO_STATUS.REQUESTED ,thumbnailUrl);

    // TODO publish message to download
}

export default {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist
}