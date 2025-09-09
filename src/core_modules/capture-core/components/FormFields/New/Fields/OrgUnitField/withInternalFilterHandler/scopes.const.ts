export const orgUnitFieldScopes = {
    USER_CAPTURE: 'USER_CAPTURE',
    USER_SEARCH: 'USER_SEARCH',
} as const;

export type OrgUnitFieldScope = typeof orgUnitFieldScopes[keyof typeof orgUnitFieldScopes];
