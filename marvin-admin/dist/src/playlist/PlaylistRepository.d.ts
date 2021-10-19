import { Playlist, Video } from '@prisma/client';
import { VIDEO_STATUS } from '../video/enum';
declare const _default: {
    getPlaylists: () => Promise<Playlist[]>;
    createPlaylist: (name: string, creatorId: number) => Promise<Playlist>;
    addVideoToPlaylist: (playlistId: number, videoName: string, videoUrl: string, path: string, status: VIDEO_STATUS, thumbnailUrl: string) => Promise<Video>;
    getPlaylistById: (playlistId: number) => Promise<Playlist | null>;
};
export default _default;
