import fs from 'fs';
import { injectable } from 'tsyringe';
import { SongInfo } from '../song/SongInfo';

const PLAYLIST_DIR = './playlists';

@injectable()
export default class PlaylistService {
  public async getAllPlaylists() {
    try {
      const directories = await fs.promises.readdir(PLAYLIST_DIR);

      return directories.reduce(
        (mapAcc: Map<String, string>, dir) =>
          mapAcc.set(dir, `${PLAYLIST_DIR}/${dir}`),
        new Map()
      );
    } catch (err) {
      console.error(err);
      // To do make a better error
      throw new Error('No such file or directory');
    }
  }

  public async getPlaylistPathByName(
    playlistName: string
  ): Promise<string | undefined> {
    const playlists = await this.getAllPlaylists();
    console.log(playlistName)
    console.log(playlists);
    return playlists.get(playlistName);
  }

  public async getPlaylistSongs(playlistName: string): Promise<SongInfo[]> {
    const playlistPath = await this.getPlaylistPathByName(playlistName);
    console.log(playlistPath  )
    if (!playlistPath) {
      // To do make a better error
      throw new Error('No such playlist');
    }

    const songFiles = await fs.promises.readdir(playlistPath);

    return songFiles.map((songFile) => ({
      url: `${PLAYLIST_DIR}/${playlistName}/${songFile}`,
      title: songFile,
    }));
  }
}
