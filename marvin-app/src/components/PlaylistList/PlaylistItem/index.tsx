import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { styled } from '@material-ui/styles';
import { Box } from "@material-ui/core";
import { LibraryMusic } from "@material-ui/icons";
import TextDetails from "./TextDetails";
import DetailButton from "./DetailButton";


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


type PlaylistListItemProps  = RouteComponentProps & {
    name: string,
    id: number,
    key: number,
}

const StyledLibraryMusicIcon = styled(LibraryMusic)({
    marginRight: "1rem",
})

const PlaylistListItem = (props: PlaylistListItemProps) => {
    const { key, id, name, history } = props;

    const playlistUrl = `/playlist/${id}`; 
    const redirectToDetailsPage = () => {
        history.push(playlistUrl)
    }

    return (
        <PlaylistItemContainer key={key}>
            <StyledLibraryMusicIcon color="action" fontSize="large" />
            <TextDetails name={name} creator={"admin"} numberOfSongs={10}/>
            <DetailButton onClick={redirectToDetailsPage}/>
        </PlaylistItemContainer>
    )
}

export default withRouter(PlaylistListItem)