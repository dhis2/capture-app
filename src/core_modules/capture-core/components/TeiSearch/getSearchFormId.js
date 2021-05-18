// @flow

export function getSearchFormId(
    searchId: string,
    contextId: string,
    searchGroupId: string,
) {
    return `${searchId}-${contextId}-${searchGroupId}`;
}

