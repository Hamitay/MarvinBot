import { Box } from '@material-ui/core';
import MarvinImage from '../../Marvin.png'

const dimension = 24;

const MarvinIcon = () => {
    return (
        <Box>
            <img alt={"marvin icon"} src={MarvinImage} height={dimension} width={dimension} style={{ margin: "0.3rem" }} />
        </Box>
    )
}

export default MarvinIcon