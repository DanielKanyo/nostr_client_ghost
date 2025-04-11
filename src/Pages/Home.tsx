import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";

export default function Home() {
    return (
        <Content>
            <MainContainer width={680}>Home</MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
