// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getFilterSelectorsComponent from './FilterSelectors.componentGetter';
import { editContents, setFilter } from './filterSelector.actions';

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onEditContents: (value: any, itemId: string) => {
        dispatch(editContents(value, itemId));
    },
    onSetFilter: (requestData: any, appliedText: string, itemId: string) => {
        dispatch(setFilter(requestData, appliedText, itemId));
    },
});

export default (InnerComponent: React.ComponentType<any>) =>
    connect(mapStateToProps, mapDispatchToProps)(getFilterSelectorsComponent(InnerComponent));
