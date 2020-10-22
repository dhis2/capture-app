// @flow
export type OwnProps = {|
  currentRowsPerPage?: number,
  listId: string
|}

export type PropsFromRedux = {|
  nextPageButtonDisabled: boolean,
  currentPage: number,
  rowsPerPage: number
|}

export type DispatchersFromRedux = {|
  onChangeRowsPerPage: Function,
  onChangePage: Function,
|};

export type Props = {
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
}
