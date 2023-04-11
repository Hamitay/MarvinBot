import { List } from "@material-ui/core";
import { Fragment } from "react";
import { Playlist } from "../../api/playlist";
import VideoListItem from "./components/VideoListItem";

type VideoListProps = {
  playlist: Playlist;
};

const VideoList = (props: VideoListProps) => {
  const { playlist } = props;
  return (
    <Fragment>
      <List>
        {playlist.videos.map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            playlistId={playlist.id}
          />
        ))}
      </List>
    </Fragment>
  );
};

export default VideoList;
