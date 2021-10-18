import { useEffect, useState } from "react"
import { getAllPlaylists, Playlist } from "../../api/playlist"
import PlaylistItem from "./PlaylistItem"
import { Box } from "@material-ui/core"
import NewPlaylistModal from "./NewPlaylistModal"
import { styled } from "@material-ui/styles"
import AddNewPlaylistButton from "./AddNewPlaylistButton.tsx"


const ListContainer = styled(Box)({
    display: "grid",
    placeItems: "center",
    marginTop: "4rem",
})

const PlaylistList = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [playlistFormEnabled, setPlaylistFormEnabled] = useState(false)
    useEffect(() => {
        const fetchPlaylists = async () => {
            const fetchedPlaylists = await getAllPlaylists();
            setPlaylists(fetchedPlaylists)
        }

        fetchPlaylists();
    }, [])

    const playlistList = playlists.map((pl) => (
        <PlaylistItem name={pl.name} id={pl.id} key={pl.id} videoAmount={pl.videos.length}/>
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
            <AddNewPlaylistButton onClick={handleClickAddNewPlaylist}/>
            {playlists.length > 0 ? playlistList : (<div>Loading</div>)}
            <NewPlaylistModal onSubmit={closePlaylistForm} open={playlistFormEnabled} handleClose={() => setPlaylistFormEnabled(false)}/>
        </ListContainer>

    )
}

export default PlaylistList