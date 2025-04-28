import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { debounce } from "lodash";

import { ActionIcon, Box, ScrollArea, Transition } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

import { updateScrollPosition } from "../Store/Features/scrollPositionSlice";
import { useAppSelector } from "../Store/hook";

export const SCROLL_POS_DEBOUNCE_TIME = 130;

interface ScrollPosition {
    x: number;
    y: number;
}

interface ScrollContainerProps {
    children: React.ReactNode;
}

export default function ScrollContainer({ children }: ScrollContainerProps) {
    const location = useLocation();
    const viewportRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useAppSelector((state) => state.scrollPosition);
    const [position, setScrollPosition] = useState(0);
    const dispatch = useDispatch();

    const getPathnameFirstSegment = useCallback(() => {
        return `/${location.pathname.split("/")[1]}`;
    }, [location.pathname]);

    const debouncedSetScrollPosition = useCallback(
        debounce((location: string, position: ScrollPosition) => {
            dispatch(updateScrollPosition({ key: location, value: position.y }));
        }, SCROLL_POS_DEBOUNCE_TIME),
        []
    );

    const handleScrollPositionChange = useCallback(
        ({ x, y }: ScrollPosition) => {
            setScrollPosition(y);
            debouncedSetScrollPosition(getPathnameFirstSegment(), { x, y });
        },
        [debouncedSetScrollPosition]
    );

    const restoreScrollPosition = useCallback(() => {
        const firstSegment = getPathnameFirstSegment();

        if (viewportRef.current && scrollPosition[firstSegment]) {
            setScrollPosition(scrollPosition[firstSegment]);

            viewportRef.current.scrollTo({
                top: scrollPosition[firstSegment],
            });
        }
    }, []);

    const scrollToTop = () => viewportRef.current!.scrollTo({ top: 0, behavior: "smooth" });

    useEffect(() => {
        restoreScrollPosition();
    }, [location.pathname]);

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
                <Box style={{ position: "absolute", bottom: 0, left: 0 }} m="xs">
                    <Transition transition="slide-up" mounted={position > 50}>
                        {(transitionStyles) => (
                            <ActionIcon
                                size={36}
                                variant="light"
                                color="gray"
                                aria-label="scroll-up"
                                style={transitionStyles}
                                radius="md"
                                onClick={scrollToTop}
                            >
                                <IconArrowUp size={16} />
                            </ActionIcon>
                        )}
                    </Transition>
                </Box>
            </ScrollArea>
        </div>
    );
}
