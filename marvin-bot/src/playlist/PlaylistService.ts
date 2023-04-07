import { injectable } from "tsyringe";
import AdminClient from "../admin/AdminClient";
import { Playlist } from "./Playlist";

const OUTPUT_PATH = process.env.OUTPUT_PATH;

@injectable()
export default class PlaylistService {
  #adminClient: AdminClient;

  constructor(adminClient: AdminClient) {
    this.#adminClient = adminClient;
  }

  public async getAllPlaylists() {
    try {
      return await this.#adminClient.getAllPlaylists();
    } catch (err) {
      console.error(err);
      throw new Error("No such file or directory");
    }
  }

  public async getPlaylistByName(playlistName: string): Promise<Playlist> {
    const playlists = await this.getAllPlaylists();

    const playlist = playlists.find(
      (playlist) => playlist.name === playlistName
    );

    if (!playlist) {
      throw new Error("Playlist not found!");
    }

    return await this.#adminClient.getPlaylistById(playlist.id);
  }

  /*
  public async getPlaylistSongs(playlistName: string): Promise<SongInfo[]> {
    let playlistId;
    try {
      playlistId = await this.getPlaylistIdByName(playlistName);
    } catch (error) {
      console.error(error);
      throw new Error(`Error getting playlist ${playlistName}`);
    }

    if (!playlistId) {
      throw new Error(`No such playlist ${playlistName}`);
    }

    const playlist = await this.#adminClient.getPlaylistById(playlistId);

    const songFiles = playlist.videos.filter(
      (video) => video.status === "FINISHED"
    );
    return songFiles.map((songFile) => ({
      url: `${OUTPUT_PATH}/${songFile.url}`,
      title: songFile.name,
    }));
  }*/
}
