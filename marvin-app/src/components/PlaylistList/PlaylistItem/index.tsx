import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { styled } from '@material-ui/styles';
import { LibraryMusic } from "@material-ui/icons";
import TextDetails from "./TextDetails";
import DetailButton from "./DetailButton";
import PlaylistItemContainer from "../../ItemContainer";

type PlaylistListItemProps  = RouteComponentProps & {
    name: string,
    id: number,
    key: number,
    videoAmount: number,
}

const StyledLibraryMusicIcon = styled(LibraryMusic)({
    marginRight: "1rem",
})

const PlaylistListItem = (props: PlaylistListItemProps) => {
    const { key, id, name, videoAmount, history } = props;

    const playlistUrl = `/playlist/${id}`; 
    const redirectToDetailsPage = () => {
        history.push(playlistUrl)
    }

    return (
        <PlaylistItemContainer key={key}>
            <StyledLibraryMusicIcon color="action" fontSize="large" />
            <TextDetails name={name} creator={"admin"} numberOfSongs={videoAmount}/>
            <DetailButton onClick={redirectToDetailsPage}/>
        </PlaylistItemContainer>
    )
}

export default withRouter(PlaylistListItem)