import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import ProfileContent from "../Layouts/Profile/ProfileContent";
import ProfileHeader from "../Layouts/Profile/ProfileHeader";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { useAppSelector } from "../Store/hook";

export default function Profile() {
    const user = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor);

    return (
        <Content>
            <MainContainer width={680}>
                <ScrollContainer>
                    <ProfileHeader
                        publicKey={user.publicKey}
                        name={user?.data?.name}
                        displayName={user?.data?.display_name}
                        about={user?.data?.about}
                        picture={user?.data?.picture}
                        banner={user?.data?.banner}
                        primaryColor={primaryColor}
                    />
                    <ProfileContent primaryColor={primaryColor} />
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
