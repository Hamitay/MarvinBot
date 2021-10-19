"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require(".prisma/client");
const client = new client_1.PrismaClient();
const getVideoById = async (videoId) => {
    return await client.video.findFirst({ where: {
            id: videoId
        } });
};
const updateVideoStatus = async (videoId, status) => {
    return await client.video.update({
        where: {
            id: videoId
        },
        data: {
            status,
        }
    });
};
exports.default = {
    getVideoById,
    updateVideoStatus
};
//# sourceMappingURL=VideoRepository.js.map