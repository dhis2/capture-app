// @flow
import { connect } from 'react-redux';
import { withErrorMessageHandler } from '../../../../HOC/withErrorMessageHandler';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { editEventIds } from '../../../WidgetEventEdit/DataEntry/editEventDataEntry.actions';
import { viewEventIds } from '../EventDetailsSection/eventDetails.actions';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import { ViewEventComponent } from './ViewEvent.component';
import { makeProgramStageSelector, makeEventAccessSelector } from './viewEvent.selectors';


const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();

    // $FlowFixMe[not-an-object] automated comment
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
// $FlowFixMe[missing-annot] automated comment
export const ViewEvent = connect(makeMapStateToProps, mapDispatchToProps)(
    withErrorMessageHandler()(ViewEventComponent),
);
