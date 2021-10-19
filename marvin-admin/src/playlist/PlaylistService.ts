import { Playlist, Video } from ".prisma/client";
import PlaylistNotFoundError from "../errors/PlaylistNotFoundError";
import { publishMessage } from "../publisher";
import { VIDEO_STATUS } from "../video/enum";
import PlaylistRepository from './PlaylistRepository';

const OUTPUT_PATH = process.env.OUTPUT_PATH;

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
    // TODO Resolve video path and resolve name colision
    const videoPath = `${OUTPUT_PATH}/${videoName}`;

    const newVideo = await PlaylistRepository.addVideoToPlaylist(playlistId, videoName, videoUrl, videoPath, VIDEO_STATUS.REQUESTED ,thumbnailUrl);

    // TODO publish message to download
    await publishMessage({ videoId: newVideo.id })

    return newVideo;
}

export default {
    getPlaylists,
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistById
}