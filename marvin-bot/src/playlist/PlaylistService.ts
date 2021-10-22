import { injectable } from "tsyringe";
import AdminClient from "../admin/AdminClient";
import { SongInfo } from "../song/SongInfo";

const OUTPUT_PATH = process.env.OUTPUT_PATH;

@injectable()
export default class PlaylistService {

  #adminClient: AdminClient;

  constructor(adminClient: AdminClient) {
    this.#adminClient = adminClient;
  }

  public async getAllPlaylists() {

    try {
      const playlists = await this.#adminClient.getAllPlaylists()

      return playlists.reduce(
        (mapAcc: Map<string, number>, playlist) =>
          mapAcc.set(playlist.name, playlist.id),
        new Map()
      );
    } catch (err) {
      console.error(err);
      throw new Error("No such file or directory");
    }
  }

  public async getPlaylistIdByName(
    playlistName: string
  ): Promise<number | undefined> {
    const playlists = await this.getAllPlaylists();
    return playlists.get(playlistName);
  }

  public async getPlaylistSongs(playlistName: string): Promise<SongInfo[]> {
    let playlistId;
    try {
      playlistId = await this.getPlaylistIdByName(playlistName);
    } catch (error) {
      console.error(error);
      throw new Error(`Error getting playlist ${playlistName}`)
    }

    if (!playlistId) {
      throw new Error(`No such playlist ${playlistName}`)
    }

    const playlist = await this.#adminClient.getPlaylistById(playlistId);

    const songFiles = playlist.videos.filter((video) => video.status === "FINISHED");
    return songFiles.map((songFile) => ({
      url: `${OUTPUT_PATH}/${songFile.url}`,
      title: songFile.name,
    }));
  }
}
