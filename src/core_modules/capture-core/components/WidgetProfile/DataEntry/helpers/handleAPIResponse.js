// @flow

export const REQUESTED_ENTITIES = Object.freeze({
    events: 'events',
    trackedEntities: 'trackedEntities',
    relationships: 'relationships',
});

export const handleAPIResponse = (resourceName: string, apiResponse: any) => {
    if (!apiResponse) {
        return [];
    }
    return apiResponse[resourceName] || apiResponse.instances || [];
};
