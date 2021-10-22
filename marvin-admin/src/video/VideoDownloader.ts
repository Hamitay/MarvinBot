import { pipeline } from "stream/promises";
import fs from "fs";
import ytdl from "ytdl-core";
import VideoService from "./VideoService";
import { VIDEO_STATUS } from "./enum";

const OUTPUT_PATH = process.env.OUTPUT_PATH;

const getVideoStream = async (url: string) => {
  return await ytdl(url, { filter: "audioonly" });
}

export const downloadVideo = async (videoId: number, name: string, url: string, messageId: string) => {
  
  console.log(`Downloading video at url: ${url}, messageId ${messageId}`);
  try {
    await VideoService.updateVideoStatus(videoId, VIDEO_STATUS.DOWNLOADING);
    const readStream = await getVideoStream(url);
    const writeStream = fs.createWriteStream(`${OUTPUT_PATH}/${name}.mp4`);

    console.log(`Pipeline started for ${messageId}`);
    await pipeline(readStream, writeStream);
    console.log(`Pipeline started for ${messageId}`);
    
    await VideoService.updateVideoStatus(videoId, VIDEO_STATUS.FINISHED);

  } catch (error) {
    console.error(error)
    await VideoService.updateVideoStatus(videoId, VIDEO_STATUS.FAILED);
  }

}