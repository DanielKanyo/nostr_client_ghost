import { ScrollArea } from "@mantine/core";

type CustomScrollAreaProps = {
    children: React.ReactNode;
};

export default function CustomScrollArea({ children }: CustomScrollAreaProps) {
    return (
        <div style={{ flex: 1, overflow: "hidden" }}>
            <ScrollArea h="100%" overscrollBehavior="contain" scrollbarSize={6}>
                {children}
            </ScrollArea>
        </div>
    );
}
