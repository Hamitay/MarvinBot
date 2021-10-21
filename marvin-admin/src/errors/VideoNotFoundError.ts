class VideoNotFoundError extends Error {
    constructor(id: number) {
        super(`Video ${id} not found`);

        Object.setPrototypeOf(this, VideoNotFoundError.prototype);
    }
}

export default VideoNotFoundError;