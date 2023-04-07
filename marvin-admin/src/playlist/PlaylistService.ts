import { Playlist, Video } from ".prisma/client";
import PlaylistNotFoundError from "../errors/PlaylistNotFoundError";
import PlaylistRepository from "./PlaylistRepository";

const getPlaylists = async (): Promise<Playlist[]> => {
  return await PlaylistRepository.getPlaylists();
};

const createPlaylist = async (name: string): Promise<Playlist> => {
  return await PlaylistRepository.createPlaylist(name);
};

const getPlaylistById = async (id: number): Promise<Playlist> => {
  const playlist = await PlaylistRepository.getPlaylistById(id);

  if (!playlist) {
    throw new PlaylistNotFoundError(id);
  }

  return playlist;
};

const addVideoToPlaylist = async (
  playlistId: number,
  videoName: string,
  videoUrl: string,
  thumbnailUrl: string
): Promise<Video> => {
  const newVideo = await PlaylistRepository.addVideoToPlaylist(
    playlistId,
    videoName,
    videoUrl,
    thumbnailUrl
  );
  return newVideo;
};

export default {
  getPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  getPlaylistById,
};
