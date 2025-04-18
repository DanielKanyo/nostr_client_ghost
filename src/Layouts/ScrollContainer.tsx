import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { debounce } from "lodash";

import { ScrollArea } from "@mantine/core";

import { SCROLL_POS_DEBOUNCE_TIME } from "../Shared/utils";
import { updateScrollPosition } from "../Store/Features/scrollPositionSlice";
import { useAppSelector } from "../Store/hook";

interface ScrollPosition {
    x: number;
    y: number;
}

interface ScrollContainerProps {
    children: React.ReactNode;
}

export default function ScrollContainer({ children }: ScrollContainerProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useAppSelector((state) => state.scrollPosition);
    const dispatch = useDispatch();

    const debouncedSetScrollPosition = useCallback(
        debounce((position: ScrollPosition) => {
            dispatch(updateScrollPosition(position.y));
        }, SCROLL_POS_DEBOUNCE_TIME),
        []
    );

    const handleScrollPositionChange = useCallback(
        ({ x, y }: ScrollPosition) => {
            debouncedSetScrollPosition({ x, y });
        },
        [debouncedSetScrollPosition]
    );

    const restoreScrollPosition = useCallback(() => {
        if (viewportRef.current && scrollPosition) {
            viewportRef.current.scrollTo({
                top: scrollPosition,
            });
        }
    }, [scrollPosition]);

    useEffect(() => {
        restoreScrollPosition();
    }, [restoreScrollPosition]);

    return (
        <div style={{ flex: 1, overflow: "hidden" }}>
            <ScrollArea
                h="100%"
                overscrollBehavior="contain"
                scrollbarSize={6}
                viewportRef={viewportRef}
                onScrollPositionChange={handleScrollPositionChange}
            >
                {children}
            </ScrollArea>
        </div>
    );
}
