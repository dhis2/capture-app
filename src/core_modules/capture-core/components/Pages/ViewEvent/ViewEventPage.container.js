// @flow
import React from 'react';
import { connect } from 'react-redux';
import ViewEventSelector from './ViewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const formHasChanges =
        state.currentSelections.complete &&
        eventDetailsSection.showEditEvent &&
        dataEntryHasChanges(state, 'singleEvent-editEvent');
    return {
        error: (state.activePage.selectionsError && state.activePage.selectionsError.error)
          || (state.activePage.viewEventLoadError && state.activePage.viewEventLoadError.error),
        ready: !state.activePage.isLoading,
        formInputInProgess: formHasChanges,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

export const ViewEventPageContainer = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventSelector)));

