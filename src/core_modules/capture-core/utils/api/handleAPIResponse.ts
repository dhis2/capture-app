// @flow

export const REQUESTED_ENTITIES = Object.freeze({
    events: 'events',
    trackedEntities: 'trackedEntities',
    relationships: 'relationships',
} as const);

type RequestedEntity = typeof REQUESTED_ENTITIES[keyof typeof REQUESTED_ENTITIES];

// This function can be removed when versions lower than 2.41 are no longer supported
export const handleAPIResponse = (resourceName: RequestedEntity, apiResponse: Record<string, unknown> | null | undefined): unknown[] => {
    if (!apiResponse) {
        return [];
    }
    return (apiResponse[resourceName] as unknown[]) || (apiResponse.instances as unknown[]) || [];
};
