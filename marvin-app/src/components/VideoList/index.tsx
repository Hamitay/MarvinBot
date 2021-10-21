import { List } from "@material-ui/core";
import { Fragment } from "react";
import { Video } from "../../api/playlist"
import VideoListItem from "./components/VideoListItem";

type VideoListProps = {
    videos: Video[]
}

const VideoList = (props: VideoListProps) => {
    const { videos } = props;
    return (
        <Fragment>
            <List>
                {videos.map((video) => (
                    <VideoListItem video={video} />
                ))}
            </List>
        </Fragment>
    )
}

export default VideoList