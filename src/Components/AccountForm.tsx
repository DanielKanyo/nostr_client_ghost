import { Group, Textarea, TextInput, Stack } from "@mantine/core";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import containedTextareaClasses from "../Shared/Styles/containedTextarea.module.css";

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
        radius: "md" as const,
        classNames: containedInputClasses,
        size: "md" as const,
    };

    return (
        <Stack gap="lg">
            <Group grow>
                <TextInput
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="e.g., satoshi123"
                    withAsterisk
                    {...sharedProps}
                />

                <TextInput
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="e.g., Satoshi Nakamoto"
                    withAsterisk
                    {...sharedProps}
                />
            </Group>

            <TextInput
                label="Profile Picture URL"
                value={picture}
                onChange={(e) => setPicture(e.currentTarget.value)}
                placeholder="https://example.com/pfp.png"
                {...sharedProps}
            />

            <TextInput
                label="Banner Picture URL"
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
                radius="md"
                size="md"
                classNames={containedTextareaClasses}
            />
        </Stack>
    );
}
