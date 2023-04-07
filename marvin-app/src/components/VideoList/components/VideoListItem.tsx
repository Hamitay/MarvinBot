import {
  Avatar,
  Divider,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
} from "@material-ui/core";
import { Fragment } from "react";
import { Video } from "../../../api/playlist";

const MAX_NAME_SIZE = 30;

type VideoListItemProps = {
  video: Video;
};

const StyledAvatar = styled(Avatar)({
  height: "6rem",
  width: "6rem",
  marginRight: "1rem",
});

const VideoListItem = (props: VideoListItemProps) => {
  const { video } = props;
  const cutName = video.name.substring(0, MAX_NAME_SIZE);
  const url = video.url;
  const cutUrl = url.replace("https://www.", "");

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
      </ListItem>
      <Divider />
    </Fragment>
  );
};

export default VideoListItem;
