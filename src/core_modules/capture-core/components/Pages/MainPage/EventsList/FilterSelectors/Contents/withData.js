// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import isDefined from 'd2-utilizr/lib/isDefined';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    value: (
        state.workingListFiltersEdit.main &&
        state.workingListFiltersEdit.main.next &&
        isDefined(state.workingListFiltersEdit.main.next[props.id])) ?
        state.workingListFiltersEdit.main.next[props.id] :
        (state.workingListFiltersEdit.main && state.workingListFiltersEdit.main[props.id]),
});

const dispatchToProps = (dispatch: ReduxDispatch) => ({
   
});

export default () => (InnerComponent: React.ComponentType<any>) => connect(mapStateToProps, dispatchToProps)(InnerComponent);
