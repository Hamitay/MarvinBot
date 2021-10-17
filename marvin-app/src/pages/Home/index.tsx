import { styled } from "@material-ui/styles";
import { Box } from "@material-ui/core"
import PlaylistList from "../../components/PlaylistList";

const PlaylistContainer = styled(Box)({
  display: "grid",
  placeItems: "center",
})

function Home() {
  return (
    <PlaylistContainer>
      <PlaylistList />
    </PlaylistContainer>
  );
}

export default Home;
