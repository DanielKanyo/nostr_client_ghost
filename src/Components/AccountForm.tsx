import { Group, Textarea, TextInput, Stack } from "@mantine/core";

interface AccountFormProps {
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

export default function AccountForm({
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
}: AccountFormProps) {
    const sharedProps = {
        variant: "filled" as const,
        size: "md" as const,
        radius: "md" as const,
    };

    return (
        <Stack gap="lg">
            <Group grow>
                <TextInput
                    label="Name"
                    description="Pick a short name"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="e.g., satoshi123"
                    withAsterisk
                    data-autofocus
                    {...sharedProps}
                />

                <TextInput
                    label="Display Name"
                    description="More friendly name to show on your profile"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="e.g., Satoshi Nakamoto"
                    withAsterisk
                    {...sharedProps}
                />
            </Group>

            <TextInput
                label="Profile Picture URL"
                description="Link to your profile image"
                value={picture}
                onChange={(e) => setPicture(e.currentTarget.value)}
                placeholder="https://example.com/pfp.png"
                {...sharedProps}
            />

            <TextInput
                label="Banner Picture URL"
                description="Link to your profile banner"
                value={banner}
                onChange={(e) => setBanner(e.currentTarget.value)}
                placeholder="https://example.com/banner.png"
                {...sharedProps}
            />

            <TextInput
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.currentTarget.value)}
                placeholder="https://yourwebsite.com"
                {...sharedProps}
            />

            <Textarea
                label="About Me"
                placeholder="Say some words about yourself"
                value={about}
                onChange={(e) => setAbout(e.currentTarget.value)}
                autosize
                minRows={3}
                {...sharedProps}
            />
        </Stack>
    );
}
