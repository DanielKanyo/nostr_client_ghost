import { Box } from "@mantine/core";

type SideContainerProps = {
    children: React.ReactNode;
    width: number;
};

export default function SideContainer({ children, width }: SideContainerProps) {
    return <Box w={width}>{children}</Box>;
}
