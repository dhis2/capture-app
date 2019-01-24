// @flow

export default function getSearchFormId(
    searchId: string,
    contextId: string,
    searchGroupId: string,
) {
    return `${searchId}-${contextId}-${searchGroupId}`;
}

