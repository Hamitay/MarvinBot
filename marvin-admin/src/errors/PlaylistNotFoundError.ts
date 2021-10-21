class PlaylistNotFoundError extends Error {
    constructor(id: number) {
        super(`Playlist ${id} not found`);

        Object.setPrototypeOf(this, PlaylistNotFoundError.prototype);
    }
}

export default PlaylistNotFoundError;