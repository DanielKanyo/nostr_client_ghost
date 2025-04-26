import { NostrEvent } from "nostr-tools";

export type InteractionStats = {
    likes: number;
    likePubkeys: string[];
    likeDetails: NostrEvent[];
    reposts: number;
    repostPubkeys: string[];
    repostDetails: NostrEvent[];
    comments: number;
    commentPubkeys: string[];
    commentDetails: NostrEvent[];
    zapAmount: number;
    zapPubkeys: string[];
    zapDetails: NostrEvent[];
};
