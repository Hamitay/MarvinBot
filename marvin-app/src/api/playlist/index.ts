import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore/lite";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAOZw7qOXOAJc27gQfwEkYwvo7BpyCdMEI",
  authDomain: "marvin-admin.firebaseapp.com",
  projectId: "marvin-admin",
  storageBucket: "marvin-admin.appspot.com",
  messagingSenderId: "831952032993",
  appId: "1:831952032993:web:3a334824bfbcadbe29d3a0",
  measurementId: "G-HJWZ8TQNJN",
};

const COLLECTION_NAME = "playlists";

export interface Playlist {
  id: string;
  name: string;
  videos: Video[];
}

export interface Creator {
  name: string;
  admin: boolean;
}

export interface Video {
  name: string;
  url: string;
  thumbnailUrl: string;
  id: string;
  status: VideoStatus;
}
export interface PlaylistRequest {
  name: string;
  creatorId: number;
}

export interface AddVideoRequest {
  name: string;
  url: string;
  thumbnailUrl: string;
}

export enum VideoStatus {
  ACTIVE,
  DELETED,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getAllPlaylists = async (): Promise<Playlist[]> => {
  const playlistsCol = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(playlistsCol);
  const playlists = snapshot.docs.map((doc) => {
    const data = doc.data() as Playlist;

    const playlist = {
      id: doc.id,
      name: data.name,
      videos: data.videos,
    };
    return playlist;
  });

  return playlists;
};

const getPlaylistById = async (id: string): Promise<Playlist> => {
  const ref = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(ref);
  const playlistData = snap.data() as Playlist;

  const activeVideos = playlistData.videos.filter(
    (video) => video.status !== VideoStatus.DELETED
  );
  const deletedVideos = playlistData.videos.filter(
    (video) => video.status === VideoStatus.DELETED
  );

  return {
    ...playlistData,
    videos: [...activeVideos, ...deletedVideos],
    id,
  };
};

const createPlaylist = async (payload: PlaylistRequest): Promise<void> => {
  const id = v4();

  await setDoc(doc(db, COLLECTION_NAME, id), {
    name: payload.name,
    videos: [],
  });
};

const addVideoToPlaylist = async (
  playlistId: string,
  payload: AddVideoRequest
): Promise<Video> => {
  const ref = doc(db, COLLECTION_NAME, playlistId);

  const newVideo = {
    ...payload,
    status: VideoStatus.ACTIVE,
    id: v4(),
  };

  await updateDoc(ref, {
    videos: arrayUnion(newVideo),
  });

  return newVideo;
};

export const updateVideoStatus = async (
  playlistId: string,
  videoId: string,
  newStatus: VideoStatus
): Promise<void> => {
  const ref = doc(db, COLLECTION_NAME, playlistId);
  const playlist = (await getDoc(ref)).data() as Playlist;
  const newVideos = playlist.videos.map((video) => {
    if (video.id === videoId) {
      return {
        ...video,
        status: newStatus,
      };
    }

    return video;
  });

  await updateDoc(ref, {
    videos: newVideos,
  });
};

export { getAllPlaylists, createPlaylist, getPlaylistById, addVideoToPlaylist };
