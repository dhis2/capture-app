// @flow
import { connect } from 'react-redux';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import ViewEvent from './ViewEvent.component';
import getDataEntryKey from '../../DataEntry/common/getDataEntryKey';
import { editEventIds } from '../EditEvent/DataEntry/editEventDataEntry.actions';
import { viewEventIds } from './EventDetailsSection/eventDetails.actions';
import { getEventProgramThrowIfNotFound } from '../../../metaData';
import withErrorMessageHandler from '../../../HOC/withErrorMessageHandler';

const getStage = (state: ReduxState) => {
    const program = getEventProgramThrowIfNotFound(state.currentSelections.programId);
    return program.getStageThrowIfNull();
};

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    return {
        programStage: getStage(state),
        error: state.viewEventPage.loadError,
        currentDataEntryKey: eventDetailsSection.showEditEvent ? getDataEntryKey(editEventIds.dataEntryId, editEventIds.itemId) : getDataEntryKey(viewEventIds.dataEntryId, viewEventIds.itemId),
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onBackToAllEvents: () => {
        dispatch(startGoBackToMainPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(withErrorMessageHandler()(ViewEvent));
