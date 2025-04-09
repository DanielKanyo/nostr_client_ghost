import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import SideBox from "../Layouts/SideBox";

export default function Profile() {
    return (
        <Content>
            <MainBox width={680}>Profile</MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
