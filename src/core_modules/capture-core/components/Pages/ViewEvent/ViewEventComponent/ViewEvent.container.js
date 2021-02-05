// @flow
import { connect } from 'react-redux';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import ViewEvent from './ViewEvent.component';
import { editEventIds } from '../../EditEvent/DataEntry/editEventDataEntry.actions';
import { viewEventIds } from '../EventDetailsSection/eventDetails.actions';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { makeProgramStageSelector, makeEventAccessSelector } from './viewEvent.selectors';


const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();

    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState) => {
        const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
        const dataEntryId = eventDetailsSection.showEditEvent ? editEventIds.dataEntryId : viewEventIds.dataEntryId;
        const ready = Boolean(state.dataEntries[dataEntryId] && state.dataEntries[dataEntryId].itemId);
        debugger;
        return {
            currentProgramId: state.currentSelections.programId,
            programStage: programStageSelector(state),
            eventAccess: eventAccessSelector(state),
            error: state.viewEventPage.loadError,
            ready,
        };
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onBackToAllEvents: () => {
        dispatch(startGoBackToMainPage());
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(withErrorMessageHandler()(ViewEvent));
