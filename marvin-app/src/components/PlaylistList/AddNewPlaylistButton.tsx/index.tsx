import { styled } from "@material-ui/styles"
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons"

type AddNewPlaylistButtonProps = {
    onClick: () => void
}

const StyledPlaylistItemContainer = styled(Button)({
    width: "19rem",
    height: "3rem",
    boxShadow: "1px 1px 1px gray",
    borderRadius: "10px",
    marginBottom: "1rem",
    display: "flex",
})

const AddNewPlaylistButton = (props: AddNewPlaylistButtonProps) => {
    const { onClick } = props
    return (
        <StyledPlaylistItemContainer 
            variant="contained" 
            color="secondary" 
            onClick={onClick}
            startIcon={<Add />}
        >
            Add New Playlist
        </StyledPlaylistItemContainer >
    )
}

export default AddNewPlaylistButton;