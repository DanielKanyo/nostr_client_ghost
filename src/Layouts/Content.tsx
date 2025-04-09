import { Flex } from "@mantine/core";

type ContentProps = {
    children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
    return (
        <Flex mih="100vh" justify="center" direction="row">
            {children}
        </Flex>
    );
}
