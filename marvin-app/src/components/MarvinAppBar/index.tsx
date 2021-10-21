import { AppBar, styled, Typography } from "@material-ui/core";

import MarvinIcon from "../MarvinIcon";


const StyledAppBar = styled(AppBar)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "fixed"
})

const StyledTypography = styled(Typography)({
    marginLeft: "0.5rem"
})

const MarvinAppBar = () => (
    <StyledAppBar>
        <MarvinIcon />
        <StyledTypography variant="h6">
            Marvin Admin
        </StyledTypography>
    </StyledAppBar>
)

export default MarvinAppBar