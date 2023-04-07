import { PrismaClient, Playlist, Video } from "@prisma/client";

const client = new PrismaClient();

const getPlaylists = async (): Promise<Playlist[]> => {
  return await client.playlist.findMany({
    include: {
      videos: {
        select: {
          name: true,
          thumbnailUrl: true,
          url: true,
          id: true,
        },
      },
    },
  });
};

const createPlaylist = async (name: string): Promise<Playlist> => {
  return await client.playlist.create({
    data: {
      name,
    },
  });
};

const getPlaylistById = async (
  playlistId: number
): Promise<Playlist | null> => {
  return await client.playlist.findFirst({
    where: {
      id: playlistId,
    },
    include: {
      videos: {
        select: {
          name: true,
          thumbnailUrl: true,
          url: true,
          id: true,
        },
      },
    },
  });
};

const addVideoToPlaylist = async (
  playlistId: number,
  videoName: string,
  videoUrl: string,
  thumbnailUrl: string
): Promise<Video> => {
  return await client.video.create({
    data: {
      name: videoName,
      url: videoUrl,
      thumbnailUrl,
      playlistId,
    },
  });
};

export default {
  getPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  getPlaylistById,
};
