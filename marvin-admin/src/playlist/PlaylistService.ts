import { Playlist, Video } from ".prisma/client";
import PlaylistNotFoundError from "../errors/PlaylistNotFoundError";
import { publishNewVideoMarvinEvent } from "../publisher";
import { VIDEO_STATUS } from "../video/enum";
import PlaylistRepository from './PlaylistRepository';

const getPlaylists = async (): Promise<Playlist[]> => {
    return await PlaylistRepository.getPlaylists();
}

const createPlaylist = async (name: string, creatorId: number): Promise<Playlist> => {
    return await PlaylistRepository.createPlaylist(name, creatorId);
}

const getPlaylistById = async (id: number): Promise<Playlist> => {
    const playlist = await PlaylistRepository.getPlaylistById(id)

    if (!playlist) {
        throw new PlaylistNotFoundError(id);
    }
    
    return playlist;
}

const addVideoToPlaylist = async (playlistId: number, videoName: string, videoUrl: string, thumbnailUrl: string): Promise<Video> => {
    const path = `${encodeURIComponent(videoName)}.mp4`;
    const newVideo = await PlaylistRepository.addVideoToPlaylist(playlistId, 
        videoName, 
        videoUrl, 
        path, 
        VIDEO_STATUS.REQUESTED,
        thumbnailUrl);

    await publishNewVideoMarvinEvent(newVideo.id);
    return newVideo;
}

export default {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistById
}