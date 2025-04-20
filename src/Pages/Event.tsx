import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../Shared/utils";

export default function Event() {
    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>Event</MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
