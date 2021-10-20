import styled from "@emotion/styled";
import { Box, Typography, TextField, Button, Modal } from "@material-ui/core";
import { useState } from "react";
import { AddVideoRequest } from "../../../api/playlist";

const THUMBNAIL_PLACEHOLDER = 'https://via.placeholder.com/170x128?text=VideoThumb'

interface NewPlaylistModalProps {
    onSubmit: (videoRequest: AddVideoRequest) => void
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
    alignItems: "center",
})

const StyledForm = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

const StyledSubmitButton = styled(Button)({
    marginTop: "1rem",
})

const ImageWrapper = styled(Box)({
    marginRight: '2rem'
})

const extractVideoId = (url: string) => {
    const ytRegex = /(.*)((\.com)|(\.be))((\/watch\?v=)|(\/))/;
    if (url.match(ytRegex)) {
        return url.replace(/(.*)((\.com)|(\.be))((\/watch\?v=)|(\/))/, '')
    }
}

const buildThumbnail = (videoId: string) => `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`

const NewVideoModal = (props: NewPlaylistModalProps) => {
    const { onSubmit, open, handleClose } = props;
    const [newVideoName, setNewVideoName] = useState<string>('');
    const [newVideoUrl, setNewVideoUrl] = useState<string>('');
    const [newVideoThumbnailUrl, setVideoThumbnailUrl] = useState<string>(THUMBNAIL_PLACEHOLDER);
    const [hasInputError, setHasInputError] = useState(false);

    const handleNameChange = (event: any) => {
        const { target: { value } } = event;
        // TODO sanitize input
        setNewVideoName(value);
    }

    const handleUrlChange = (event: any) => {
        const { target: { value } } = event;
        // TODO sanitize input
        setNewVideoUrl(value);
        const videoId = extractVideoId(value);

        if (videoId) {
            setVideoThumbnailUrl(buildThumbnail(videoId))
        } else {
            setVideoThumbnailUrl(THUMBNAIL_PLACEHOLDER);
        }
    }

    const handleSubmit = async () => {
        if (!newVideoName || newVideoName === '') {
            return setHasInputError(true);
        }

        const request = {
            name: newVideoName,
            url: newVideoUrl,
            thumbnailUrl: newVideoThumbnailUrl
        }

        onSubmit(request)
        closeModal()
    }

    const cleanModal = () => {
        setNewVideoName('');
        setNewVideoUrl('');
        setVideoThumbnailUrl('');
    }

    const closeModal = () => {
        cleanModal()
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
                <ImageWrapper>
                    <img alt={'video-thumbnail'} src={newVideoThumbnailUrl} height='128rem' />
                </ImageWrapper>
                <StyledForm>
                    <Typography variant="h6" >Add new Video</Typography>
                    <TextField
                        required
                        id="playlist-url"
                        label="Video Url"
                        value={newVideoUrl}
                        onChange={handleUrlChange}
                        error={hasInputError}

                    />
                    <TextField
                        required
                        id="playlist-name"
                        label="Video Name"
                        value={newVideoName}
                        onChange={handleNameChange}
                        error={hasInputError}

                    />
                    <StyledSubmitButton
                        onClick={handleSubmit}
                        variant={"contained"}
                        color={"primary"}
                    >
                        Submit
                    </StyledSubmitButton>
                </StyledForm>

            </StyledModalContent>
        </StyledModal>
    )
}

export default NewVideoModal;