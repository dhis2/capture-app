// @flow
import { connect } from 'react-redux';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import ViewEvent from './ViewEvent.component';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import { editEventIds } from '../../EditEvent/DataEntry/editEventDataEntry.actions';
import { viewEventIds } from '../EventDetailsSection/eventDetails.actions';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { makeProgramStageSelector, makeEventAccessSelector } from './viewEvent.selectors';


const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();

    return (state: ReduxState) => {
        const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
        return {
            programStage: programStageSelector(state),
            eventAccess: eventAccessSelector(state),
            error: state.viewEventPage.loadError,
            currentDataEntryKey: eventDetailsSection.showEditEvent ? getDataEntryKey(editEventIds.dataEntryId, editEventIds.itemId) : getDataEntryKey(viewEventIds.dataEntryId, viewEventIds.itemId),
        };
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onBackToAllEvents: () => {
        dispatch(startGoBackToMainPage());
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(withErrorMessageHandler()(ViewEvent));
