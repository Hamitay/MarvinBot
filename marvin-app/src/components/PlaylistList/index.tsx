import { useEffect, useState } from "react"
import { getAllPlaylists, Playlist } from "../../api/playlist"
import PlaylistItem from "./PlaylistItem"
import { Box } from "@material-ui/core"
import NewPlaylistModal from "./NewPlaylistModal"
import { styled } from "@material-ui/styles"


const ListContainer = styled(Box)({
    display: "grid",
    placeItems: "center",
})

const PlaylistList = () => {
    const [users, setUsers] = useState<Playlist[]>([])
    const [playlistFormEnabled, setPlaylistFormEnabled] = useState(false)
    useEffect(() => {
        const fetchPlaylists = async () => {
            const fetchedPlaylists = await getAllPlaylists();
            setUsers(fetchedPlaylists)
        }

        fetchPlaylists();
    }, [])

    const playlistList = users.map((pl) => (
        <PlaylistItem name={pl.name} id={pl.id} key={pl.id} />
    ))

    const handleClickAddNewPlaylist = () => {
        setPlaylistFormEnabled(true)
    }

    const closePlaylistForm = () => {
        //setPlaylistFormEnabled(false);
        window.location.reload()
    }

    return (
        <ListContainer>
            <div>
                {users.length > 0 ? playlistList : (<div>Loading</div>)}
            </div>
            <div>
                <button onClick={handleClickAddNewPlaylist}>New Playlist</button>
            </div>
            <NewPlaylistModal onSubmit={closePlaylistForm} open={playlistFormEnabled} handleClose={() => setPlaylistFormEnabled(false)}/>
        </ListContainer>

    )
}

export default PlaylistList