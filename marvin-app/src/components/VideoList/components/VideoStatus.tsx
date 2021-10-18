import { Box, CircularProgress, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { VideoStatusEnum } from "../../../api/playlist";
import { Error, CheckCircle } from "@material-ui/icons"

type VideoStatusProps = {
    status: VideoStatusEnum
}

const VideoStatusContainer = styled(Box)({
    marginRight: '1rem',
    marginLeft: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
})

const DownloadingVideoStatus = () => (
    <VideoStatusContainer>
        <CircularProgress />
    </VideoStatusContainer>
)

const FailedVideoStatus = () => (
    <VideoStatusContainer>
        <Error fontSize="large" color="error" />
        <Typography variant="subtitle2" color="error">Error</Typography>
    </VideoStatusContainer>
)

const FinishedVideoStatus = () => (
    <VideoStatusContainer>
        <CheckCircle fontSize="large" color="primary" />
    </VideoStatusContainer>
)

const VideoStatus = (props: VideoStatusProps) => {
    const { status } = props;

    switch (status) {
        case VideoStatusEnum.REQUESTED:
        case VideoStatusEnum.DOWNLOADING:
            return <DownloadingVideoStatus />
        case VideoStatusEnum.FAILED:
            return <FailedVideoStatus />
        default:
            return <FinishedVideoStatus />
    }
}

export default VideoStatus;