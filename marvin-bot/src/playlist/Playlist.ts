export interface Playlist {
    name: string,
    id: number,
    videos: Video[]
}

interface Video {
    name: string,
    url: string,
    id: number,
    status: string,
}