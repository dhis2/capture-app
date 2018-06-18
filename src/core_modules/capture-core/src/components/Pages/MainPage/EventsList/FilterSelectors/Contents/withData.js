// @flow
import * as React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    value: state.workingListFiltersEdit.main && state.workingListFiltersEdit.main[props.id],
});

const dispatchToProps = (dispatch: ReduxDispatch) => ({
   
});

export default () => (InnerComponent: React.ComponentType<any>) => connect(mapStateToProps, dispatchToProps)(InnerComponent);
