import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import SideBox from "../Layouts/SideBox";

export default function Messages() {
    return (
        <Content>
            <MainBox width={680}>Messages</MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
