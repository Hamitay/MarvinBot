"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlaylistNotFoundError extends Error {
    constructor(id) {
        super(`Playlist ${id} not found`);
        Object.setPrototypeOf(this, PlaylistNotFoundError.prototype);
    }
}
exports.default = PlaylistNotFoundError;
//# sourceMappingURL=PlaylistNotFoundError.js.map