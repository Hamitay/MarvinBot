import { Video } from "@prisma/client";
import VideoNotFoundError from "../errors/VideoNotFoundError";
import VideoRepository from "./VideoRepository";

const getVideoById = async (videoId: number): Promise<Video> => {
  const video = await VideoRepository.getVideoById(videoId);

  if (!video) {
    throw new VideoNotFoundError(videoId);
  }

  return video;
};

export default {
  getVideoById,
};
