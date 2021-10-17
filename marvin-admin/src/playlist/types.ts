export interface NewPlaylistRequest {
    name: string,
    creatorId: number,
}

export interface AddVideoRequest {
    name: string,
    url: string,
    thumbnailUrl: string,
}