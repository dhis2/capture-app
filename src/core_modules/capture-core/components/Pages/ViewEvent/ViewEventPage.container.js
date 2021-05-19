// @flow
import { connect } from 'react-redux';
import { ViewEventPageComponent } from './ViewEventPage.component';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const isUserInteractionInProgress =
      (state.currentSelections.complete && eventDetailsSection.showEditEvent)
          ?
          dataEntryHasChanges(state, 'singleEvent-editEvent')
          :
          false;
    return {
        error: state.activePage.viewEventLoadError && state.activePage.viewEventLoadError.error,
        ready: !state.activePage.lockedSelectorLoads,
        isUserInteractionInProgress,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

// $FlowFixMe[missing-annot] automated comment
export const ViewEventPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventPageComponent)));

