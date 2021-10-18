import styled from "@emotion/styled";
import { Box, Typography, TextField, Button, Modal } from "@material-ui/core";
import { useState } from "react";
import { createPlaylist } from "../../../api/playlist";

interface NewPlaylistModalProps {
    onSubmit: () => void
    handleClose: () => void
    open: boolean
}

const StyledModal = styled(Modal)({
    display: "grid",
    placeItems: "center",
    position: "absolute"
})

const StyledModalContent = styled(Box)({
    backgroundColor: "white",
    padding: "1.5rem 2.5rem 1.5rem 2.5rem",
    borderRadius: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

const StyledSubmitButton = styled(Button)({
    marginTop: "1rem",
})

const NewPlaylistModal = (props: NewPlaylistModalProps) => {
    const { onSubmit, open, handleClose } = props;
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');
    const [hasInputError, setHasInputError] = useState(false);

    const handleChange = (event: any) => {
        const { target: { value } } = event;
        // TODO sanitize input
        setNewPlaylistName(value);
    }

    const handleSubmit = async () => {
        if (!newPlaylistName || newPlaylistName === '') {
            return setHasInputError(true);
        }

        await createPlaylist({ name: newPlaylistName, creatorId: 1 })
        setNewPlaylistName('')
        if (onSubmit) {
            onSubmit()
        }
    }

    const closeModal = () => {
        setNewPlaylistName('');
        handleClose();
    }

    const onClose = (data: any, reason: string) => {
        if (reason === 'backdropClick') {
            closeModal()
        }
    }

    return (
        <StyledModal open={open} onClose={onClose}>
            <StyledModalContent>
                <Typography variant="h6" >Add new Playlist</Typography>
                <TextField
                    required
                    id="playlist-name"
                    label="Playlist Name"
                    value={newPlaylistName}
                    onChange={handleChange}
                    error={hasInputError}

                />
                <StyledSubmitButton
                    onClick={handleSubmit}
                    variant={"contained"}
                    color={"primary"}
                >
                    Submit
                </StyledSubmitButton>
            </StyledModalContent>
        </StyledModal>
    )
}

export default NewPlaylistModal;