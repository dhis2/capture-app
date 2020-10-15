// @flow

export type OwnProps = {|
    nextPageButtonDisabled: boolean,
|};
type DispatchersFromFromRedux = {|
    onChangePage: Function,
|};
type PropsFromRedux = {|
    currentPage: number,
|};

export type Props ={| ...OwnProps, ...DispatchersFromFromRedux, ...PropsFromRedux, ...CssClasses |}
