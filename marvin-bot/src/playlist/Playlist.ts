export interface Playlist {
  name: string;
  id: string;
  videos: Video[];
}

export enum VideoStatus {
  ACTIVE,
  DELETED,
}

interface Video {
  name: string;
  url: string;
  id: string;
  status: VideoStatus;
}
