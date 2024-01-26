// @flow
import { FEATURES, hasAPISupportForFeature } from 'capture-core-utils';

export const handleAPIResponseByMinorVersion = (
    resourceName: string,
    apiResponse: any,
    minorVersion: string | number,
) => {
    if (!apiResponse) {
        return [];
    }
    return hasAPISupportForFeature(minorVersion, FEATURES.exportablePayload)
        ? apiResponse[resourceName] || []
        : apiResponse.instances;
};

export const handleAPIResponse = (resourceName: string, apiResponse: any) => {
    if (!apiResponse) {
        return [];
    }
    return apiResponse[resourceName] || apiResponse.instances || [];
};
