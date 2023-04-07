export interface Playlist {
  name: string;
  id: string;
  videos: Video[];
}

interface Video {
  name: string;
  url: string;
  id: string;
  status: string;
}
