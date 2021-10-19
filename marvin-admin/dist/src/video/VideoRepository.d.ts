import { Video } from ".prisma/client";
import { VIDEO_STATUS } from "./enum";
declare const _default: {
    getVideoById: (videoId: number) => Promise<Video | null>;
    updateVideoStatus: (videoId: number, status: VIDEO_STATUS) => Promise<Video | null>;
};
export default _default;
