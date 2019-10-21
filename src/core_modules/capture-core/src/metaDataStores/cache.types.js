// @flow

export type CachedCategoryOption = {
    id: string,
    displayName: string,
    organisationUnitIds: ?Array<string>,
    access: Object,
};

export type CachedCategory = {
    id: string,
    displayName: string,
};

export type CachedCategoryOptionsByCategory = {
    id: string,
    options: Array<CachedCategoryOption>,
};

export type CachedProgramCategory = {
    id: string,
};
