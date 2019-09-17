// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getFilterSelectorsComponent from './FilterSelectors.componentGetter';
import { restMenuItemSelected } from './filterSelector.actions';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    userSelectedFilters: state.workingListsUserSelectedFilters[props.listId],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onRestMenuItemSelected: (id: string) => {
        dispatch(restMenuItemSelected(id));
    },
});

export default (InnerComponent: React.ComponentType<any>) =>
    connect(mapStateToProps, mapDispatchToProps)(getFilterSelectorsComponent(InnerComponent));
