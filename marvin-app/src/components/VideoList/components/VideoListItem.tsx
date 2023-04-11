import {
  Avatar,
  Divider,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  styled,
} from "@material-ui/core";
import { Fragment, useState } from "react";
import { Video, VideoStatus, updateVideoStatus } from "../../../api/playlist";
import { Delete, Restore } from "@material-ui/icons";

const MAX_NAME_SIZE = 30;

type VideoListItemProps = {
  playlistId: string;
  video: Video;
};

const StyledAvatar = styled(Avatar)({
  height: "6rem",
  width: "6rem",
  marginRight: "1rem",
});

const VideoListItem = (props: VideoListItemProps) => {
  const { playlistId, video } = props;
  const [currentStatus, setCurrentStatus] = useState<VideoStatus>(
    props.video.status
  );

  const cutName = video.name.substring(0, MAX_NAME_SIZE);
  const url = video.url;
  const cutUrl = url.replace("https://www.", "");

  const handleDeleteVideo = async () => {
    await updateVideoStatus(playlistId, video.id, VideoStatus.DELETED);
    setCurrentStatus(VideoStatus.DELETED);
  };

  const handleRestoreVideo = async () => {
    await updateVideoStatus(playlistId, video.id, VideoStatus.ACTIVE);
    setCurrentStatus(VideoStatus.ACTIVE);
  };

  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar>
          <StyledAvatar src={video.thumbnailUrl} variant="square" />
        </ListItemAvatar>
        <ListItemText
          primary={cutName}
          secondary={
            <Link href={url} target="_blank" rel="noopener,noreferrer">
              {cutUrl}
            </Link>
          }
        />
        {currentStatus === VideoStatus.DELETED ? (
          <Tooltip title="Restore video">
            <IconButton onClick={handleRestoreVideo}>
              <Restore></Restore>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Delete video">
            <IconButton onClick={handleDeleteVideo}>
              <Delete></Delete>
            </IconButton>
          </Tooltip>
        )}
      </ListItem>
      <Divider />
    </Fragment>
  );
};

export default VideoListItem;
