import type { RequestedEntitiesType } from '../types/dataEntry.types';

export const REQUESTED_ENTITIES: RequestedEntitiesType = Object.freeze({
    events: 'events',
    trackedEntities: 'trackedEntities',
    relationships: 'relationships',
});

export const handleAPIResponse = (resourceName: string, apiResponse: any): any[] => {
    if (!apiResponse) {
        return [];
    }
    return apiResponse[resourceName] || apiResponse.instances || [];
};
