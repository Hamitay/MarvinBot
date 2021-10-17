import axios, { AxiosResponse } from "axios"

const API_URL = "http://localhost:5000"

export interface Playlist {
    id: number,
    name: string
    creator: string
    createdAt: Date,
    updatedAt: Date
}

export interface PlaylistRequest {
    name: string,
    creatorId: string,
}

const getAllPlaylists = async () : Promise<Playlist[]> => {
    const response = await axios.get(API_URL + '/playlists')
    return response.data;
}

const createPlaylist = async (payload: PlaylistRequest) : Promise<Playlist> => {
    const response = await axios.post<PlaylistRequest, AxiosResponse<Playlist>>(API_URL + '/playlists', payload)
    return response.data;
}

export {
    getAllPlaylists,
    createPlaylist
}