// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import isDefined from 'd2-utilizr/lib/isDefined';

const mapStateToProps = (state: ReduxState, props: { listId: string, id: string }) => {
    const listId = props.listId;
    return {
        value: (
            state.workingListFiltersEdit[listId] &&
            state.workingListFiltersEdit[listId].next &&
            isDefined(state.workingListFiltersEdit[listId].next[props.id])) ?
            state.workingListFiltersEdit[listId].next[props.id] :
            (state.workingListFiltersEdit[listId] && state.workingListFiltersEdit[listId][props.id]),
    };
};

const dispatchToProps = (dispatch: ReduxDispatch) => ({
   
});

export default () => (InnerComponent: React.ComponentType<any>) => connect(mapStateToProps, dispatchToProps)(InnerComponent);
