export const REQUESTED_ENTITIES = {
    trackedEntities: 'trackedEntities',
    events: 'events',
};

export const handleAPIResponse = (requestedEntities: string, result: any) => {
    if (result.status === 'ERROR') {
        return [];
    }

    return result[requestedEntities] || [];
};
