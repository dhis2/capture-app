// @flow
import * as React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state: ReduxState) => ({
    rowsPerPage: state.workingListsUI.main.rowsPerPage,
    currentPage: state.workingListsUI.main.currentPage,
    rowsCount: state.workingListsUI.main.rowsCount,
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(mapStateToProps)(InnerComponent);
