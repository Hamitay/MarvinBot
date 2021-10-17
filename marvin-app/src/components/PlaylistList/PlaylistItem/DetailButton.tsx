import { IconButton } from "@material-ui/core"
import { MoreVert } from "@material-ui/icons"
import { styled } from "@material-ui/styles"

const StyledIconButton = styled(IconButton)({
    marginRight: "0"
})

type DetailButtonProps = {
    onClick: () => void,
}

const DetailButton = (props: DetailButtonProps) => (
    <StyledIconButton onClick={props.onClick}>
        <MoreVert />
    </StyledIconButton>
)
export default DetailButton;