// @flow

export type CategoryOption = {
    id: string,
    displayName: string,
}

export type ProgramCategory = {
    displayName: string,
    id: string,
    categories: Array<CategoryOption>
}
