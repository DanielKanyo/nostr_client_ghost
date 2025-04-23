import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { debounce } from "lodash";

import { ScrollArea } from "@mantine/core";

import { updateScrollPosition } from "../Store/Features/scrollPositionSlice";
import { useAppSelector } from "../Store/hook";

export const SCROLL_POS_DEBOUNCE_TIME = 300;

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
            debouncedSetScrollPosition(getPathnameFirstSegment(), { x, y });
        },
        [debouncedSetScrollPosition]
    );

    const restoreScrollPosition = useCallback(() => {
        const firstSegment = getPathnameFirstSegment();

        if (viewportRef.current && scrollPosition[firstSegment]) {
            viewportRef.current.scrollTo({
                top: scrollPosition[firstSegment],
            });
        }
    }, []);

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
            </ScrollArea>
        </div>
    );
}
