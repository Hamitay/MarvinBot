"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VideoNotFoundError extends Error {
    constructor(id) {
        super(`Video ${id} not found`);
        Object.setPrototypeOf(this, VideoNotFoundError.prototype);
    }
}
exports.default = VideoNotFoundError;
//# sourceMappingURL=VideoNotFoundError.js.map