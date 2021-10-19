import { Video } from "@prisma/client";
import { VIDEO_STATUS } from "./enum";
declare const _default: {
    getVideoById: (videoId: number) => Promise<Video>;
    updateVideoStatus: (videoId: number, status: VIDEO_STATUS) => Promise<void>;
};
export default _default;
