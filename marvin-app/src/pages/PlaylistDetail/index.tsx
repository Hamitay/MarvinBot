import { Box, styled } from '@material-ui/core';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddVideoRequest, addVideoToPlaylist, getPlaylistById, Playlist, Video } from '../../api/playlist';
import PlaylistHeader from '../../components/PlaylistHeader';
import VideoList from '../../components/VideoList';
import NewVideoModal from '../../components/VideoList/NewVideoModal';

interface PlaylistDetailsParams {
    playlistId?: string
}

const PlaylistDetailContainer = styled(Box)({
    display: 'grid',
    placeItems: 'center',
})

const PlaylistContentContainer = styled(Box)({
    maxWidth: "50rem",
    marginTop: "3rem"
})

const PlaylistDetail = () => {
    const { playlistId } = useParams<PlaylistDetailsParams>()
    const [isLoading, setIsLoading] = useState(true);
    const [playlist, setPlaylist] = useState<Playlist>({} as Playlist)
    const [newVideoModalEnabled, setNewVideoModalEnabled] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (playlistId) {
                const fetchedPlaylist = await getPlaylistById(playlistId);
                setPlaylist(fetchedPlaylist)
                setIsLoading(false);
            }
        }
        fetchPlaylist();
    }, [])

    const handleAddVideo = (playlistId: string) => async (videoRequest: AddVideoRequest) => {
        const newVideo = await addVideoToPlaylist(playlistId, videoRequest);

        const newPlaylist = {
            ...playlist,
            videos: [
                ...playlist.videos,
                newVideo
            ]
        }

        setPlaylist(newPlaylist);
    }

    const enabledModal = () => {
        setNewVideoModalEnabled(true);
    }

    const disableModal = () => {
        setNewVideoModalEnabled(false)
    }

    return (
        <Fragment>
            <PlaylistDetailContainer>
                {
                    isLoading ?
                        <div>Loading</div> :
                        <PlaylistContentContainer>
                            <PlaylistHeader playlist={playlist} handleAddButtonClicked={enabledModal} />
                            <VideoList videos={playlist.videos} />
                        </PlaylistContentContainer>
                }
            </PlaylistDetailContainer>
            {
                playlistId && <NewVideoModal
                    open={newVideoModalEnabled}
                    handleClose={disableModal}
                    onSubmit={handleAddVideo(playlistId)} />
            }
        </Fragment>
    )
}

export default PlaylistDetail;