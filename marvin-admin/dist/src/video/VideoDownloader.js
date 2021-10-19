"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadVideo = void 0;
const stream_1 = require("stream");
const fs_1 = __importDefault(require("fs"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const VideoService_1 = __importDefault(require("./VideoService"));
const enum_1 = require("./enum");
const getVideoStream = async (url) => {
    return await (0, ytdl_core_1.default)(url, { filter: 'audioonly' });
};
const downloadVideo = async (videoId, name, url) => {
    const readStream = await getVideoStream(url);
    const writeStream = fs_1.default.createWriteStream(`${name}.mp4`);
    console.log("Pipeline started");
    await (0, stream_1.pipeline)(readStream, writeStream, () => {
        console.log("Finished downloading video");
        try {
            VideoService_1.default.updateVideoStatus(videoId, enum_1.VIDEO_STATUS.FINISHED);
        }
        catch (error) {
            console.log(error);
        }
    });
    console.log("Pipeline ended");
};
exports.downloadVideo = downloadVideo;
//# sourceMappingURL=VideoDownloader.js.map