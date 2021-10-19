"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VideoNotFoundError_1 = __importDefault(require("../errors/VideoNotFoundError"));
const VideoRepository_1 = __importDefault(require("./VideoRepository"));
const getVideoById = async (videoId) => {
    const video = await VideoRepository_1.default.getVideoById(videoId);
    if (!video) {
        throw new VideoNotFoundError_1.default(videoId);
    }
    return video;
};
const updateVideoStatus = async (videoId, status) => {
    try {
        await updateVideoStatus(videoId, status);
    }
    catch (error) {
        console.error('error');
    }
};
exports.default = {
    getVideoById,
    updateVideoStatus
};
//# sourceMappingURL=VideoService.js.map