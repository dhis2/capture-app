// @flow
import { connect } from 'react-redux';
import NewEventPage from './NewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState) => {
    const isUserInteractionInProgress = state.currentSelections.complete &&
      dataEntryHasChanges(state, 'singleEvent-newEvent') &&
      state.newEventPage.showAddRelationship;
    return {
        isSelectionsComplete: !!state.currentSelections.complete,
        isUserInteractionInProgress,
    };
};

export default connect(mapStateToProps)(NewEventPage);
