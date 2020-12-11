// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { changePage, changeRowsPerPage } from './pagination.actions';

const mapStateToProps = (state: ReduxState, props: { listId: string }) => ({
  rowsPerPage: state.workingListsMeta[props.listId].rowsPerPage,
  currentPage: state.workingListsMeta[props.listId].currentPage,
  rowsCount: state.workingListsMeta[props.listId].rowsCount,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onChangeRowsPerPage: (listId: string, rowsPerPage: number) => {
    dispatch(changeRowsPerPage(listId, rowsPerPage));
  },
  onChangePage: (listId: string, page: number) => {
    dispatch(changePage(listId, page));
  },
});

export default () => (InnerComponent: React.ComponentType<any>) =>
  // $FlowFixMe[missing-annot] automated comment
  connect(mapStateToProps, mapDispatchToProps)(InnerComponent);
