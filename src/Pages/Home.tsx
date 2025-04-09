import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import SideBox from "../Layouts/SideBox";

export default function Home() {
    return (
        <Content>
            <MainBox width={680}>Home</MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
