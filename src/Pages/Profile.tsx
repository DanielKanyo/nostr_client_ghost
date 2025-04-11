import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import ProfileHeader from "../Layouts/ProfileHeader";
import SideContainer from "../Layouts/SideContainer";
import { useAppSelector } from "../Store/hook";

export default function Profile() {
    const user = useAppSelector((state) => state.user).data;

    return (
        <Content>
            <MainContainer width={680}>
                <ProfileHeader picture={user?.picture} banner={user?.banner} />
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
