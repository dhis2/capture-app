// @flow
export type ReviewDuplicatesActionCreator = {|
    pageSize: number,
    orgUnitId: string,
    selectedScopeId: string,
    scopeType: string,
    dataEntryId: string
|}

export type ChangePageActionCreator = {|
    pageSize: number,
    page: number,
    orgUnitId: string,
    selectedScopeId: string,
    scopeType: string,
    dataEntryId: string
|}
