// @flow
import { connect } from 'react-redux';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { ViewEventPageComponent } from './ViewEventPage.component';

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

