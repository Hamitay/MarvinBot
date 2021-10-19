import { pipeline } from "stream/promises";
import fs from "fs";
import ytdl from "ytdl-core";
import VideoService from "./VideoService";
import { VIDEO_STATUS } from "./enum";

const OUTPUT_PATH = process.env.OUTPUT_PATH;

const getVideoStream = async (url: string) => {
  return await ytdl(url, { filter: 'audioonly' });
}

export const downloadVideo = async (videoId: number, name: string, url: string) => {
  const readStream = await getVideoStream(url);
  const writeStream = fs.createWriteStream(`${OUTPUT_PATH}/${name}.mp4`);

  console.log("Pipeline started")
  await pipeline(readStream, writeStream);
  console.log("Pipeline ended")
  await VideoService.updateVideoStatus(videoId, VIDEO_STATUS.FINISHED);
}