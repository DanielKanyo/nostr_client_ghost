import { ScrollArea } from "@mantine/core";

type ScrollContainerProps = {
    children: React.ReactNode;
};

export default function ScrollContainer({ children }: ScrollContainerProps) {
    return (
        <div style={{ flex: 1, overflow: "hidden" }}>
            <ScrollArea h="100%" overscrollBehavior="contain" scrollbarSize={6} scrollbars="y">
                {children}
            </ScrollArea>
        </div>
    );
}
