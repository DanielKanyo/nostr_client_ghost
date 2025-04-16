import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import Notes from "../Layouts/Notes";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";

export default function Home() {
    return (
        <Content>
            <MainContainer width={680}>
                <ScrollContainer>
                    <Notes />
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
