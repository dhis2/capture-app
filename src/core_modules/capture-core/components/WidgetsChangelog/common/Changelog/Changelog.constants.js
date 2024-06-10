// @flow

export const CHANGE_TYPES = Object.freeze({
    CREATED: 'CREATE',
    DELETED: 'DELETE',
    UPDATED: 'UPDATE',
});

export const CHANGELOG_ENTITY_TYPES = Object.freeze({
    EVENT: 'event',
    TRACKED_ENTITY: 'trackedEntity',
});

export const QUERY_KEYS_BY_ENTITY_TYPE = Object.freeze({
    [CHANGELOG_ENTITY_TYPES.EVENT]: 'events',
    [CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY]: 'trackedEntities',
});
