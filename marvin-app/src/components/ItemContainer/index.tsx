import { Box } from "@material-ui/core";
import { styled } from "@material-ui/styles";

const PlaylistItemContainer = styled(Box)({
    width: "18rem",
    border: "1px",
    borderStyle: "solid",
    borderColor: "lightGray",
    boxShadow: "1px 1px 1px gray",
    borderRadius: "10px",
    marginBottom: "1rem",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly"
})

export default PlaylistItemContainer;