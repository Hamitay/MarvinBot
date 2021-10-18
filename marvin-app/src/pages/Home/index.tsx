import { styled } from "@material-ui/styles";
import { Box } from "@material-ui/core"
import PlaylistList from "../../components/PlaylistList";
import MarvinAppBar from "../../components/MarvinAppBar";
import { Fragment } from "react";

const PlaylistContainer = styled(Box)({
  display: "grid",
  placeItems: "center",
})

function Home() {
  return (
    <Fragment>
      <MarvinAppBar />
      <PlaylistContainer>
        <PlaylistList />
      </PlaylistContainer>
    </Fragment>
  );
}

export default Home;
