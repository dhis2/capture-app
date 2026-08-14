export const Authorities = Object.freeze({
    UNCOMPLETE_EVENT: 'F_UNCOMPLETE_EVENT',
    EDIT_EXPIRED: 'F_EDIT_EXPIRED',
    TEI_CASCADE_DELETE: 'F_TEI_CASCADE_DELETE',
    ENROLLMENT_CASCADE_DELETE: 'F_ENROLLMENT_CASCADE_DELETE',
} as const);

export type Authority = typeof Authorities[keyof typeof Authorities];
