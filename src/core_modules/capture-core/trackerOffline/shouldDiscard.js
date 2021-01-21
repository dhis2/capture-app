// @flow
import type { ApiError } from '@dhis2/app-runtime';

const errorTypes = {
    NETWORK: 'network',
    ACCESS: 'access',
    UNKNOWN: 'unknown',
};

const shouldDiscardRequestWithAccessError = ({ details: { httpStatusCode } }) => httpStatusCode !== 401;

const shouldDiscardRequestWithUnknownError = ({ message }) => {
    const statusCodeSearchResult = message.match(/\(\d*\)$/);
    if (statusCodeSearchResult) {
        const statusCode = statusCodeSearchResult[0].replace(/[()]/g, '');
        return Boolean(statusCode) && ![408, 429, 502, 503, 504].includes(statusCode);
    }
    return false;
};

export const shouldDiscard = (error?: ApiError) => {
    if (!error?.type) {
        return false;
    }

    switch (error.type) {
    case errorTypes.NETWORK:
        return false;
    case errorTypes.ACCESS:
        return shouldDiscardRequestWithAccessError(error);
    case errorTypes.UNKNOWN:
        return shouldDiscardRequestWithUnknownError(error);
    default:
        return false;
    }
};
