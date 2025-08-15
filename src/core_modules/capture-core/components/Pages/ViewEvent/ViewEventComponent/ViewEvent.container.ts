import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { rollbackAssignee, setAssignee } from './viewEvent.actions';
import { cancelEditEventDataEntry } from '../../../WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import { ViewEventComponent } from './ViewEvent.component';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { withErrorMessageHandler } from '../../../../HOC/withErrorMessageHandler';
import {
    makeAssignedUserContextSelector,
    makeEventAccessSelector,
    makeProgramStageSelector,
} from './viewEvent.selectors';
import { dataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import { setCurrentDataEntry } from '../../../DataEntry/actions/dataEntry.actions';
import type { ReduxState, ReduxDispatch } from '../../../App/withAppUrlSync.types';

const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();
    const assignedUserContextSelector = makeAssignedUserContextSelector();

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
            assignee: state.viewEventPage.loadedValues?.eventContainer?.event?.assignee,
            getAssignedUserSaveContext: () => assignedUserContextSelector(state),
            eventId: state.viewEventPage.eventId,
            showEditEvent: eventDetailsSection.showEditEvent,
        };
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onBackToViewEvent: () => {
        dispatch(batchActions([
            cancelEditEventDataEntry(),
            setCurrentDataEntry(dataEntryIds.SINGLE_EVENT, dataEntryKeys.VIEW),
        ]));
    },
    dispatch,
});

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    const mergedProps = {
        onSaveAssignee: (newAssignee: any) => {
            dispatchProps.dispatch(setAssignee(newAssignee, stateProps.eventId));
        },
        onSaveAssigneeError: (prevAssignee: any) => {
            dispatchProps.dispatch(rollbackAssignee(prevAssignee, stateProps.eventId));
        },
    };

    return Object.assign({}, ownProps, stateProps, dispatchProps, mergedProps);
};

export const ViewEvent = connect(
    makeMapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(withErrorMessageHandler()(ViewEventComponent));
