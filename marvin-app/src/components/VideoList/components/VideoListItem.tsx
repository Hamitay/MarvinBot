import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText, styled } from "@material-ui/core"
import { Fragment } from "react"
import { Video } from "../../../api/playlist"
import VideoStatus from "./VideoStatus"

const MAX_NAME_SIZE = 30;

type VideoListItemProps = {
    video: Video,
}

const StyledAvatar = styled(Avatar)({
    height: '3rem',
    width: '3rem'
})

const VideoListItem = (props: VideoListItemProps) => {
    const { video } = props;
    const cutName = video.name.substring(0, MAX_NAME_SIZE)
    const cutUrl = video.thirdPartyUrl.replace('https://www.', '')

    const handleOnClick = () => {
        window.open(video.thirdPartyUrl, '_blank', 'noopener,noreferrer')
    }
    return (
        <Fragment>
            <ListItem
                button
                onClick={handleOnClick}>
                <ListItemAvatar>
                    <StyledAvatar src={video.thumbnailUrl} variant="square" />
                </ListItemAvatar>
                <ListItemText primary={cutName} secondary={cutUrl} />
                <VideoStatus status={video.status} />
            </ListItem>
            <Divider />
        </Fragment>
    )
}

export default VideoListItem