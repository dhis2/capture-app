// @flow
import { connect } from 'react-redux';
import { NewEventPageComponent } from './NewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => {
    const isUserInteractionInProgress =
      (state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-newEvent'))
      ||
      state.newEventPage.showAddRelationship;

    return {
        error: state.activePage.selectionsError && state.activePage.selectionsError.error,
        ready: !state.activePage.isPageLoading,
        isSelectionsComplete: !!state.currentSelections.complete,
        isUserInteractionInProgress,
    };
};

// $FlowFixMe[missing-annot] automated comment
export const NewEventPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(NewEventPageComponent)));
