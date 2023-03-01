// @flow

export type CategoryOption = {
    id: string,
    name: string,
}

export type ProgramCategory = {
    displayName: string,
    id: string,
    categories: Array<CategoryOption>
}
