// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getFilterSelectorsComponent from './FilterSelectors.componentGetter';
import { restMenuItemSelected } from './filterSelector.actions';
import { makeOnItemSelectedSelector } from './filterSelectors.selectors';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    stickyFilters: state.workingListsStickyFilters[props.listId],
});

const mapDispatchToProps = () => {
    const onItemSelectedMemoized = makeOnItemSelectedSelector();

    return (dispatch: ReduxDispatch, props: Object) => ({
        onRestMenuItemSelected: onItemSelectedMemoized({
            dispatch,
            listId: props.listId,
            onItemSelected: restMenuItemSelected,
        }),
    });
};

export default (InnerComponent: React.ComponentType<any>) =>
    connect(mapStateToProps, mapDispatchToProps)(getFilterSelectorsComponent(InnerComponent));
