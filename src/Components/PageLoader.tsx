import { Center, Loader } from "@mantine/core";

export default function PageLoader() {
    return (
        <Center style={{ height: "100vh" }}>
            <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
        </Center>
    );
}
