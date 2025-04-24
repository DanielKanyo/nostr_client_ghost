import PageTitle from "../../Components/PageTitle";
import UserItem from "../../Components/UserItem";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";

export default function MutedAccounts() {
    const mutedAccounts = useAppSelector((state) => state.mutedAccounts);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Muted Accounts" withBackBtn />
                <ScrollContainer>
                    {/* TODO: Load users metadata, hide follow/unfollow button */}
                    {mutedAccounts.map((pubkey) => (
                        <UserItem key={pubkey} displayName={pubkey} picture={undefined} name={pubkey} pubkey={pubkey} />
                    ))}
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
