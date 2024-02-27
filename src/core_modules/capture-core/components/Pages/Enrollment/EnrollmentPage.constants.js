// @flow
export const enrollmentPageStatuses = {
    DEFAULT: 'DEFAULT',
    LOADING: 'LOADING',
    ERROR: 'ERROR',
    MISSING_SELECTIONS: 'MISSING_SELECTIONS',
};

export const selectionStatus = {
    READY: 'READY',
    ERROR: 'ERROR',
    LOADING: 'LOADING',
};

export const enrollmentAccessLevels = {
    FULL_ACCESS: 'FULL_ACCESS',
    LIMITED_ACCESS: 'LIMITED_ACCESS',
    NO_ACCESS: 'NO_ACCESS',
    UNKNOWN_ACCESS: 'UNKNOWN_ACCESS',
};

export const serverErrorMessages = {
    OWNERSHIP_ACCESS_PARTIALLY_DENIED: 'OWNERSHIP_ACCESS_PARTIALLY_DENIED',
    OWNERSHIP_ACCESS_DENIED: 'OWNERSHIP_ACCESS_DENIED',
    PROGRAM_ACCESS_CLOSED: 'PROGRAM_ACCESS_CLOSED',
    ORGUNIT_OUT_OF_SCOPE: 'User has no read access to organisation unit:',
};
