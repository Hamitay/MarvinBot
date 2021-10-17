import styled from "@emotion/styled";
import { Box, Typography, TextField, Button, Modal, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useState } from "react";
import { createPlaylist } from "../../../api/playlist";

interface NewPlaylistModalProps {
    onSubmit: () => void
    handleClose: () => void
    open: boolean
}

/*
            <Box >
                <Box marginBottom="20px">
                    <Typography variant="h6" >Add new Playlist</Typography>
                    <Button onClick={handleClose}>X</Button>
                </Box>
                <TextField
                    required
                    id="playlist-name"
                    label="Playlist Name"
                    value={newPlaylistName}
                    onChange={handleChange}
                />
                <Button onClick={handleSubmit}>Submit</Button>
            </Box>
*/



// const ModalContent = () => (
//     <StyledModalContent>
//         <Box marginBottom="20px">
//                     <Typography variant="h6" >Add new Playlist</Typography>
//                     <Button onClick={handleClose}>X</Button>
//                 </Box>
//                 <TextField
//                     required
//                     id="playlist-name"
//                     label="Playlist Name"
//                     value={newPlaylistName}
//                     onChange={handleChange}
//                 />
//                 <Button onClick={handleSubmit}>Submit</Button>
//     </StyledModalContent>
// )

const StyledModal = styled(Modal)({
    display: "grid",
    placeItems: "center",
})

const StyledModalContent = styled(Box)({
    backgroundColor: "white",
    padding: "0 2rem 0.5rem 2rem",
    borderRadius: "1rem",
    display: "flex",
    flexDirection: "column"
})

const BoxWrapper = styled(Box)({
    display: "flex",
    flexDirection: "column",
})

const BoxWrapperRow = styled(Box)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
})

const StyledButton = styled(IconButton)({
    position: "relative",
})

const NewPlaylistModal = (props: NewPlaylistModalProps) => {
    const { onSubmit, open, handleClose } = props;
    const [newPlaylistName, setNewPlaylistName] = useState<string>();

    const handleChange = (event: any) => {
        const { target: { value } } = event;
        setNewPlaylistName(value);
    }

    const handleSubmit = async () => {
        if (newPlaylistName) {
            await createPlaylist({ name: newPlaylistName, creatorId: "1" })
        }

        setNewPlaylistName(undefined)
        if (onSubmit) {
            onSubmit()
        }
    }

    return (
        <StyledModal open={open}>
            <StyledModalContent>
                <StyledButton onClick={handleClose}>
                    <Close fontSize="large" />
                </StyledButton>
                <BoxWrapperRow>
                    <Typography variant="h6" >Add new Playlist</Typography>
                </BoxWrapperRow>
                <BoxWrapper>
                    <TextField
                        required
                        id="playlist-name"
                        label="Playlist Name"
                        value={newPlaylistName}
                        onChange={handleChange}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </BoxWrapper>
            </StyledModalContent>
        </StyledModal>
    )
}

export default NewPlaylistModal;