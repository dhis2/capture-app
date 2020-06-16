// @flow
import { connect } from 'react-redux';
import { ViewEventPageComponent } from './ViewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const isUserInteractionInProgress =
        state.currentSelections.complete &&
        eventDetailsSection.showEditEvent &&
        dataEntryHasChanges(state, 'singleEvent-editEvent');
    return {
        error: state.activePage.viewEventLoadError && state.activePage.viewEventLoadError.error,
        ready: !state.activePage.isPageLoading,
        isUserInteractionInProgress,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

export const ViewEventPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventPageComponent)));

