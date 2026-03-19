export const enrollmentPageStatuses = {
    DEFAULT: 'DEFAULT',
    LOADING: 'LOADING',
    ERROR: 'ERROR',
    MISSING_SELECTIONS: 'MISSING_SELECTIONS',
} as const;

export const selectionStatus = {
    READY: 'READY',
    ERROR: 'ERROR',
    LOADING: 'LOADING',
} as const;

export const enrollmentAccessLevels = {
    FULL_ACCESS: 'FULL_ACCESS',
    LIMITED_ACCESS: 'LIMITED_ACCESS',
    NO_ACCESS: 'NO_ACCESS',
    UNKNOWN_ACCESS: 'UNKNOWN_ACCESS',
} as const;

export const serverErrorMessages = {
    OWNERSHIP_ACCESS_PARTIALLY_DENIED: 'OWNERSHIP_ACCESS_PARTIALLY_DENIED',
    OWNERSHIP_ACCESS_DENIED: 'OWNERSHIP_ACCESS_DENIED',
    PROGRAM_ACCESS_CLOSED: 'PROGRAM_ACCESS_CLOSED',
    ORGUNIT_OUT_OF_SCOPE: 'User has no read access to organisation unit:',
} as const;
