import { injectable } from "tsyringe";
import { Playlist } from "../playlist/Playlist";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  getDoc,
  doc,
} from "firebase/firestore/lite";

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

@injectable()
export default class AdminClient {
  #db: Firestore;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.#db = getFirestore(app);
  }

  getAllPlaylists = async (): Promise<Playlist[]> => {
    const playlistsCol = collection(this.#db, COLLECTION_NAME);
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

  getPlaylistById = async (id: string): Promise<Playlist> => {
    const ref = doc(this.#db, COLLECTION_NAME, id);
    const snap = await getDoc(ref);
    return snap.data() as Playlist;
  };
}
