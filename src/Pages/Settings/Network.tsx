import PageTitle from "../../Components/PageTitle";
import RelayStatusIndicator from "../../Components/RelayStatusIndicator";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import SideContainer from "../../Layouts/SideContainer";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../../Shared/utils";

export default function Network() {
    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Network" withBackBtn />
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>
                <RelayStatusIndicator toggleAccordion />
            </SideContainer>
        </Content>
    );
}
