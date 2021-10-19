import { Playlist, Video } from ".prisma/client";
declare const _default: {
    getPlaylists: () => Promise<Playlist[]>;
    createPlaylist: (name: string, creatorId: number) => Promise<Playlist>;
    addVideoToPlaylist: (playlistId: number, videoName: string, videoUrl: string, thumbnailUrl: string) => Promise<Video>;
    getPlaylistById: (id: number) => Promise<Playlist>;
};
export default _default;
