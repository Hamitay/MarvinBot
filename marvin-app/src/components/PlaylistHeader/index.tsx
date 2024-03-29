import { Box, IconButton, Paper, Typography } from "@material-ui/core";
import { AddCircle, MusicNote } from "@material-ui/icons";
import { styled } from "@material-ui/styles";
import { Playlist } from "../../api/playlist";

type PlaylistHeaderProps = {
  playlist: Playlist;
  handleAddButtonClicked: () => void;
};

const HeaderContainer = styled(Paper)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const IconContainer = styled(Box)({
  display: "grid",
  placeItems: "center",
  margin: "1rem",
});

const TypographyContainer = styled(Box)({
  marginTop: "1rem",
  marginBottom: "1rem",
});

const TitleTypography = styled(Typography)({});

const AddVideoButton = styled(IconButton)({
  height: "48px",
  width: "48px",
  marginLeft: "auto",
  marginRight: "2rem",
});

const StyledAddCircle = styled(AddCircle)({
  color: "#2ac751",
  fontSize: "48px",
});

const PlaylistHeader = (props: PlaylistHeaderProps) => {
  const { playlist, handleAddButtonClicked } = props;
  const { name } = playlist;

  return (
    <HeaderContainer square>
      <IconContainer>
        <MusicNote fontSize={"large"} />
      </IconContainer>
      <TypographyContainer>
        <TitleTypography variant={"body2"}>Playlist</TitleTypography>
        <TitleTypography variant={"h5"}>{name}</TitleTypography>
      </TypographyContainer>
      <AddVideoButton onClick={handleAddButtonClicked}>
        <StyledAddCircle />
      </AddVideoButton>
    </HeaderContainer>
  );
};

export default PlaylistHeader;
