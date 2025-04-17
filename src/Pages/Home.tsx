import Content from "../Layouts/Content";
import CreateNote from "../Layouts/CreateNote";
import MainContainer from "../Layouts/MainContainer";
import Notes from "../Layouts/Notes";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { NoteFilterOptions } from "../Shared/utils";
import { useAppSelector } from "../Store/hook";

export default function Home() {
    const user = useAppSelector((state) => state.user);

    return (
        <Content>
            <MainContainer width={680}>
                <ScrollContainer>
                    <CreateNote />
                    <Notes pubkeys={user.following} filterOptions={NoteFilterOptions.Posts} />
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
