// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { changePage, changeRowsPerPage } from './pagination.actions';

const mapStateToProps = (state: ReduxState) => ({
    rowsPerPage: state.workingListsMeta.main.rowsPerPage,
    currentPage: state.workingListsMeta.main.currentPage,
    rowsCount: state.workingListsMeta.main.rowsCount,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangeRowsPerPage: (rowsPerPage: number) => {
        dispatch(changeRowsPerPage(rowsPerPage));
    },
    onChangePage: (page: number) => {
        dispatch(changePage(page));
    },
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(mapStateToProps, mapDispatchToProps)(InnerComponent);
