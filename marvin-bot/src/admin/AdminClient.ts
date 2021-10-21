import { injectable } from "tsyringe";
import axios, { AxiosResponse } from "axios"
import { Playlist } from "../playlist/Playlist";

const ADMIN_URL = 'http://marvin.api.hamitay.com/api';

@injectable()
export default class AdminClient {
    constructor() {}

    getAllPlaylists = async (): Promise<Playlist[]> =>  {
        const response = await axios.get<Playlist[]>(ADMIN_URL+'/playlist');
        return response.data;
    }

    getPlaylistById = async (id: number): Promise<Playlist> => {
        const response = await axios.get<Playlist>(ADMIN_URL + `/playlist/${id}`);
        return response.data;
    }
}