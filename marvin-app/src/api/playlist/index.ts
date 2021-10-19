import axios, { AxiosResponse } from "axios"

const API_URL = "http://localhost:5000"

export interface Playlist {
    id: number,
    name: string
    creator: Creator
    createdAt: Date,
    updatedAt: Date
    videos: Video[]
}

export interface Creator {
    name: string,
    admin: boolean
}

export enum VideoStatusEnum {
    FAILED = "FAILED",
    REQUESTED = "REQUESTED",
    DOWNLOADING = "DOWNLOADING",
    FINISHED = "FINISHED"
}
export interface Video {
    name: string,
    thirdPartyUrl: string,
    thumbnailUrl: string,
    status: VideoStatusEnum,
    id: number,
}
export interface PlaylistRequest {
    name: string,
    creatorId: number,
}

export interface AddVideoRequest {
    name: string,
    url: string,
    thumbnailUrl: string,
}

const sanitizeName = (name: string): string => {
    return name
        .trim()
        .replace(/[\s]+/g, "_")
        .toLowerCase();
}

const getAllPlaylists = async (): Promise<Playlist[]> => {
    const response = await axios.get(API_URL + '/playlist')
    return response.data;
}

const getPlaylistById = async (id: string): Promise<Playlist> => {
    const response = await axios.get(API_URL + `/playlist/${id}`);
    return response.data;
}

const createPlaylist = async (payload: PlaylistRequest): Promise<Playlist> => {
    const sanitizedPayload = {
        ...payload,
        name: sanitizeName(payload.name),
    }
    const response = await axios.post<PlaylistRequest, AxiosResponse<Playlist>>(API_URL + '/playlist', sanitizedPayload)
    return response.data;
}

const addVideoToPlaylist = async (playlistId: string, payload: AddVideoRequest): Promise<Video> => {
    const sanitizedPayload = {
        ...payload,
        name: sanitizeName(payload.name),
    }
    const response = await axios.put<AddVideoRequest, AxiosResponse<Video>>(`${API_URL}/playlist/${playlistId}/addVideo`, sanitizedPayload)
    return response.data;
}

export {
    getAllPlaylists,
    createPlaylist,
    getPlaylistById,
    addVideoToPlaylist
}