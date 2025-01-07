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

export const SORT_DIRECTION = Object.freeze({
    ASC: 'asc',
    DESC: 'desc',
    DEFAULT: 'default',
});

export const COLUMN_TO_SORT_BY = Object.freeze({
    DATE: 'createdAt',
    USERNAME: 'username',
    DATA_ITEM: 'change',
});

export const DEFAULT_PAGE_SIZE = 10;

export const QUERY_KEYS_BY_ENTITY_TYPE = Object.freeze({
    [CHANGELOG_ENTITY_TYPES.EVENT]: 'events',
    [CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY]: 'trackedEntities',
});
