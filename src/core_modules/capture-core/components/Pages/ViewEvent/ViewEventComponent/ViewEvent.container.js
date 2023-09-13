// @flow
import { connect } from 'react-redux';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import { ViewEventComponent } from './ViewEvent.component';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';

import { withErrorMessageHandler } from '../../../../HOC/withErrorMessageHandler';
import {
    makeProgramStageSelector,
    makeEventAccessSelector,
    makeAssignedUserContextSelector,
} from './viewEvent.selectors';
import { dataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';

const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();
    const assignedUserContextSelector = makeAssignedUserContextSelector();

    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState) => {
        const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
        const currentDataEntryKey = eventDetailsSection.showEditEvent
            ? getDataEntryKey(dataEntryIds.SINGLE_EVENT, dataEntryKeys.EDIT)
            : getDataEntryKey(dataEntryIds.SINGLE_EVENT, dataEntryKeys.VIEW);
        const isUserInteractionInProgress = dataEntryHasChanges(state, currentDataEntryKey);
        return {
            programStage: programStageSelector(state),
            eventAccess: eventAccessSelector(state),
            error: state.viewEventPage.loadError,
            currentDataEntryKey,
            isUserInteractionInProgress,
            assignee: state.viewEventPage.loadedValues?.eventContainer.event.assignee,
            onGetAssignedUserSaveContext: assignee => assignedUserContextSelector(state)(assignee),
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
