import { Box, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";

const ItalicTypography = styled(Typography)({
    fontStyle: "italic",
})

const TextDetailsContainer = styled(Box)({
    flexGrow: 2,
})

const MAX_NAME_SIZE = 30;
const MAX_CREATOR_SIZE = 10;

const getNumberOfSongsLabel = (numberOfSongs: number) => {
    if (numberOfSongs === 0) {
        return "No songs";
    }

    return numberOfSongs === 1 ? `${numberOfSongs} song` : `${numberOfSongs} songs`
}

const TextDetails = (props: { name: string, creator: string, numberOfSongs: number }) => {
    const { name, creator, numberOfSongs } = props;
    const croppedName = name.substring(0, MAX_NAME_SIZE);
    const croppedCreator = creator.substring(0, MAX_CREATOR_SIZE);
    return (
        <TextDetailsContainer>
            <Typography variant={"h6"}>{croppedName}</Typography>
            <ItalicTypography variant={"subtitle2"}>{getNumberOfSongsLabel(numberOfSongs)}</ItalicTypography>
            <ItalicTypography variant={"subtitle2"}>{`Creator: ${croppedCreator}`}</ItalicTypography>
        </TextDetailsContainer>
    )
}

export default TextDetails