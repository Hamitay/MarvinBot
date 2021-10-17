import { useParams } from 'react-router-dom';

interface PlaylistDetailsParams {
    playlistId?: string
}

const PlaylistDetail = () => {
    const { playlistId } = useParams<PlaylistDetailsParams>()

    return (
        <div>
            {playlistId}
        </div>
    )
}

export default PlaylistDetail;