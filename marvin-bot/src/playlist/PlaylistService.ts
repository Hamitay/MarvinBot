import { injectable } from "tsyringe";
import AdminClient from "../admin/AdminClient";
import { Playlist } from "./Playlist";

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
}
