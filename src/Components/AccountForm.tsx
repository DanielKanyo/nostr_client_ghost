import { Group, Textarea, TextInput, Stack, CSSProperties } from "@mantine/core";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import containedTextareaClasses from "../Shared/Styles/containedTextarea.module.css";
import { useAppSelector } from "../Store/hook";

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
    const { borderColor } = useAppSelector((state) => state.primaryColor);

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
                    style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                />

                <TextInput
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="e.g., Satoshi Nakamoto"
                    withAsterisk
                    {...sharedProps}
                    style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                />
            </Group>

            <TextInput
                label="Profile Picture URL"
                value={picture}
                onChange={(e) => setPicture(e.currentTarget.value)}
                placeholder="https://example.com/pfp.png"
                {...sharedProps}
                style={{ "--input-border-color-focus": borderColor } as CSSProperties}
            />

            <TextInput
                label="Banner Picture URL"
                value={banner}
                onChange={(e) => setBanner(e.currentTarget.value)}
                placeholder="https://example.com/banner.png"
                {...sharedProps}
                style={{ "--input-border-color-focus": borderColor } as CSSProperties}
            />

            <TextInput
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.currentTarget.value)}
                placeholder="https://yourwebsite.com"
                {...sharedProps}
                style={{ "--input-border-color-focus": borderColor } as CSSProperties}
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
                style={{ "--input-border-color-focus": borderColor } as CSSProperties}
            />
        </Stack>
    );
}
