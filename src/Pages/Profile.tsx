import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import ProfileHeader from "../Layouts/ProfileHeader";
import SideBox from "../Layouts/SideBox";
import { useAppSelector } from "../Store/hook";

export default function Profile() {
    const user = useAppSelector((state) => state.user).data;

    return (
        <Content>
            <MainBox width={680}>
                <ProfileHeader picture={user?.picture} banner={user?.banner} />
            </MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
