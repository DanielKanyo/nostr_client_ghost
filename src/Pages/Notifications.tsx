import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";

export default function Notifications() {
    return (
        <Content>
            <MainContainer width={680}>Notifications</MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
