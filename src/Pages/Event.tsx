import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import PageTitle from "../Components/PageTitle";
import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";
import { decodeNEvent } from "../Services/noteService";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../Shared/utils";
import { useAppSelector } from "../Store/hook";
import { InteractionStats } from "../Types/interactionStats";

export default function Event() {
    const nd = useAppSelector((state) => state.noteData);
    const su = useAppSelector((state) => state.selectedUser);
    const { nevent } = useParams<{ nevent: string }>();
    const decodedEvent = decodeNEvent(nevent!);

    const [event, setEvent] = useState<NostrEvent | null>(null);
    const [interactions, setInteractions] = useState<InteractionStats | null>(null);

    const fetchEventData = useCallback(async () => {
        // TODO
    }, []);

    useEffect(() => {
        if (!decodedEvent) return;

        const note = nd.notes.find((n) => n.id === decodedEvent.id) || su.notes.find((n) => n.id === decodedEvent.id) || null;
        const interaction = nd.interactionStats[decodedEvent.id] || su.interactionStatsForNotes[decodedEvent.id] || null;

        if (note && interaction) {
            setEvent(note);
            setInteractions(interaction);
        } else {
            // If missing, fetch from network
            fetchEventData();
        }
    }, [decodedEvent, nd, su, fetchEventData]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Thread" withBackBtn />
                WIP
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
