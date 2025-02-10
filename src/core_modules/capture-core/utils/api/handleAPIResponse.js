// @flow

export const REQUESTED_ENTITIES = Object.freeze({
    events: 'events',
    trackedEntities: 'trackedEntities',
    relationships: 'relationships',
});

// This function can be removed when versions lower than 2.41 are no longer supported
export const handleAPIResponse = (resourceName: string, apiResponse: any) => {
    if (!apiResponse) {
        return [];
    }
    return apiResponse[resourceName] || apiResponse.instances || [];
};
