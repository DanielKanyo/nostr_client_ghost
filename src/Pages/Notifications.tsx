import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import SideBox from "../Layouts/SideBox";

export default function Notifications() {
    return (
        <Content>
            <MainBox width={680}>Notifications</MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
