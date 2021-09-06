import ytpl from 'ytpl';
import ytdl, { getInfo } from 'ytdl-core';
import { injectable } from 'tsyringe';

import { SongInfo } from '../song/SongInfo';

const YT_PLAYLIST_URL = '/playlist?list=';

@injectable()
export default class YoutubeService {
  public async getSongInfo(url: string): Promise<SongInfo[]> {
    if (this.isPlaylist(url)) {
      return await this.getPlaylistInfo(url);
    } else {
      return [await this.getSingleVideoInfo(url)];
    }
  }

  public isPlaylist(url: string): boolean {
    return url.includes(YT_PLAYLIST_URL);
  }

  public async getPlaylistInfo(url: string): Promise<SongInfo[]> {
    const playlistInfo = await ytpl(url)

    const songs = playlistInfo.items.map((item: ytpl.Item) => ({
      title: item.title,
      url: item.url,
    }));

    return songs;
  }

  public async getSingleVideoInfo(url: string): Promise<SongInfo> {
    const videoInfo = await getInfo(url);
    return {
      url: url,
      title: videoInfo.videoDetails?.title,
    };
  }

  public async getVideoStream(url: string) {
    return await ytdl(url);
  }
}
