import { PrismaClient, Video } from ".prisma/client";

const client = new PrismaClient();

const getVideoById = async (videoId: number): Promise<Video | null> => {
  return await client.video.findFirst({
    where: {
      id: videoId,
    },
  });
};

export default {
  getVideoById,
};
