import { injectable } from "tsyringe";
import { pipeline } from "stream";
import fs from "fs";

import YoutubeService from "../thirdParty/YoutubeService";


const PLAYLIST_PATH = '';

@injectable()
export default class VideoService {

    #youtubeService: YoutubeService;

    constructor(youtubeService: YoutubeService) {
        this.#youtubeService = youtubeService;
    }

    public async createVideo() {
        
    }

    public async downloadVideo(url: string) {
        const readStream = await this.#youtubeService.getVideoStream(url);
        const writeStream = fs.createWriteStream('test3.mp4');

        console.log("Pipeline started")
        await pipeline(readStream, writeStream, () => console.log("what"));
        console.log("Pipeline ended")
    }

}