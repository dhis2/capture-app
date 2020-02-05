// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// eslint-disable-next-line complexity
const mapStateToProps = (state: ReduxState, props: { listId: string, id: string }) => {
    const listId = props.listId;

    const nextValue = state.workingListsMeta[listId] &&
        state.workingListsMeta[listId].next &&
        state.workingListsMeta[listId].next.filters &&
        state.workingListsMeta[listId].next.filters[props.id];

    const currentValue = state.workingListsMeta[listId] &&
        state.workingListsMeta[listId].filters &&
        state.workingListsMeta[listId].filters[props.id];

    return {
        filter: (nextValue !== undefined ? nextValue : currentValue),
    };
};

const dispatchToProps = (dispatch: ReduxDispatch) => ({

});

export default () => (InnerComponent: React.ComponentType<any>) => connect(mapStateToProps, dispatchToProps)(InnerComponent);
