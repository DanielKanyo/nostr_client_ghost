import { Box } from "@mantine/core";

type SideBoxProps = {
    children: React.ReactNode;
    width: number;
};

export default function SideBox({ children, width }: SideBoxProps) {
    return <Box w={width}>{children}</Box>;
}
