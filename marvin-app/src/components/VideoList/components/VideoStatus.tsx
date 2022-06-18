import { Box, CircularProgress, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { VideoStatusEnum } from "../../../api/playlist";
import { CheckCircle, Warning } from "@material-ui/icons";

type VideoStatusProps = {
  status: VideoStatusEnum;
  handleRetry: () => void;
};

type FailedVideoStatusProps = {
  onClick: () => void;
};

const VideoStatusContainer = styled(Box)({
  marginRight: "1rem",
  marginLeft: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem",
});

const ClickableVideoStatusContainer = styled(VideoStatusContainer)({
  borderRadius: "1rem",
  color: "rgba(84, 110, 122, 1)",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "rgba(0, 0, 0, 0.20)",
    color: "white",
  },
});

const DownloadingVideoStatus = () => (
  <VideoStatusContainer>
    <CircularProgress />
  </VideoStatusContainer>
);

const FailedVideoStatus: React.FC<FailedVideoStatusProps> = ({ onClick }) => (
  <ClickableVideoStatusContainer onClick={onClick}>
    <Warning fontSize="large" />
    <Typography variant="subtitle2">Retry?</Typography>
  </ClickableVideoStatusContainer>
);

const FinishedVideoStatus = () => (
  <VideoStatusContainer>
    <CheckCircle fontSize="large" color="primary" />
  </VideoStatusContainer>
);

const VideoStatus = (props: VideoStatusProps) => {
  const { status, handleRetry } = props;
  switch (status) {
    case VideoStatusEnum.REQUESTED:
    case VideoStatusEnum.DOWNLOADING:
      return <DownloadingVideoStatus />;
    case VideoStatusEnum.FAILED:
      return <FailedVideoStatus onClick={handleRetry} />;
    default:
      return <FinishedVideoStatus />;
  }
};

export default VideoStatus;
