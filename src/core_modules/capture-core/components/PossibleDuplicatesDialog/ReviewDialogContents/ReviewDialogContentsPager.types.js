// @flow

export type OwnProps = {|
    nextPageButtonDisabled: boolean,
    dataEntryId: string,
    selectedScopeId: string
|};
type DispatchersFromFromRedux = {|
    onChangePage: Function,
|};
type PropsFromRedux = {|
    currentPage: number,
|};

export type Props ={| ...OwnProps, ...DispatchersFromFromRedux, ...PropsFromRedux, ...CssClasses |}
