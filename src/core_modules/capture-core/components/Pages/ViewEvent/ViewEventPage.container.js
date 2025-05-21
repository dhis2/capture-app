// @flow
import { connect } from 'react-redux';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { ViewEventPageComponent } from './ViewEventPage.component';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const isReadOnly = eventDetailsSection.showEditEvent;
    const eventOrgUnitId = state.viewEventPage.loadedValues?.orgUnit?.id;
    const isUserInteractionInProgress =
      (state.currentSelections.complete && eventDetailsSection.showEditEvent)
          ?
          dataEntryHasChanges(state, `${dataEntryIds.SINGLE_EVENT}-${dataEntryKeys.EDIT}`)
          :
          false;
    return {
        error: state.activePage.viewEventLoadError && state.activePage.viewEventLoadError.error,
        ready: !state.activePage.lockedSelectorLoads,
        isUserInteractionInProgress,
        isReadOnly,
        orgUnitId: eventOrgUnitId,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

// $FlowFixMe[missing-annot] automated comment
export const ViewEventPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventPageComponent)));

