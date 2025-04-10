import { Group, Textarea, TextInput } from "@mantine/core";

interface SignUpFormProps {
    name: string;
    displayName: string;
    picture: string;
    banner: string;
    website: string;
    about: string;
    setName: (v: string) => void;
    setDisplayName: (v: string) => void;
    setPicture: (v: string) => void;
    setBanner: (v: string) => void;
    setWebsite: (v: string) => void;
    setAbout: (v: string) => void;
}

export default function SignUpForm({
    name,
    displayName,
    picture,
    banner,
    website,
    about,
    setName,
    setDisplayName,
    setPicture,
    setBanner,
    setWebsite,
    setAbout,
}: SignUpFormProps) {
    return (
        <>
            <Group grow gap="lg">
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Name"
                    description="Pick a short name"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter your name"
                    withAsterisk
                    data-autofocus
                />
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Display Name"
                    description="Pick a longer display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="Enter your display name"
                    withAsterisk
                />
            </Group>
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Profile Picture Url"
                value={picture}
                onChange={(e) => setPicture(e.currentTarget.value)}
                placeholder="Enter the url to your profile picture"
            />
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Banner Picture Url"
                value={banner}
                onChange={(e) => setBanner(e.currentTarget.value)}
                placeholder="Enter the url to your banner picture"
            />
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.currentTarget.value)}
                placeholder="https://yourwebsite.com"
            />
            <Textarea
                label="About Me"
                placeholder="Say some words about yourself"
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                value={about}
                onChange={(e) => setAbout(e.currentTarget.value)}
                autosize
                minRows={3}
            />
        </>
    );
}
