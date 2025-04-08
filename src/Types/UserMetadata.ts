export interface UserMetadata {
    name?: string; // Short nickname
    display_name?: string; // Full display name
    about?: string; // Bio or description
    picture?: string; // Profile image URL
    banner?: string; // Banner image URL
    nip05?: string; // NIP-05 identifier (e.g. name@domain.com)
    lud06?: string; // LNURL for tipping (deprecated in favor of lud16)
    lud16?: string; // Lightning address (e.g. name@domain.com)
    website?: string; // Personal website URL
    username?: string; // Optional username used by some clients
    // You can add additional custom fields if needed:
    [key: string]: any;
}
