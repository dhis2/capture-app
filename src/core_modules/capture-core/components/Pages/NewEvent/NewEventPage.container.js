// @flow
import { connect } from 'react-redux';
import NewEventPage from './NewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => {
    const isUserInteractionInProgress =
      (state.currentSelections.complete &&
      dataEntryHasChanges(state, 'singleEvent-newEvent')) ||
      state.newEventPage.showAddRelationship;
    return {
        error: state.activePage.selectionsError && state.activePage.selectionsError.error,
        ready: !state.activePage.isLoading,
        isSelectionsComplete: !!state.currentSelections.complete,
        isUserInteractionInProgress,
    };
};

export default connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(NewEventPage)));
