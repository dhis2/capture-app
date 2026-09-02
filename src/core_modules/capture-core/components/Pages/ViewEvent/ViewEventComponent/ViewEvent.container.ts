import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { getTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';
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
import { makeProgramRulesSelector } from '../../../DataEntry/dataEntryOutput/dataEntryOutput.selectors';
import { dataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import { setCurrentDataEntry } from '../../../DataEntry/actions/dataEntry.actions';
import type { ReduxState, ReduxDispatch } from '../../../App/withAppUrlSync.types';

const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();
    const assignedUserContextSelector = makeAssignedUserContextSelector();
    const programRulesSelector = makeProgramRulesSelector();

    return (state: ReduxState) => {
        const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
        const currentDataEntryKey = eventDetailsSection.showEditEvent
            ? getDataEntryKey(dataEntryIds.SINGLE_EVENT, dataEntryKeys.EDIT)
            : getDataEntryKey(dataEntryIds.SINGLE_EVENT, dataEntryKeys.VIEW);
        const isUserInteractionInProgress = dataEntryHasChanges(state, currentDataEntryKey);
        const programId = state.currentSelections.programId;
        const eventLabel = programId ? getTermLabel(programId, 'event') : undefined;
        return {
            programStage: programStageSelector(state),
            eventAccess: eventAccessSelector(state),
            error: state.viewEventPage.loadError,
            currentDataEntryKey,
            isUserInteractionInProgress,
            assignee: state.viewEventPage.loadedValues?.eventContainer?.event?.assignee,
            getAssignedUserSaveContext: () => assignedUserContextSelector(state),
            eventId: state.viewEventPage.eventId,
            isEditEventPage: eventDetailsSection.showEditEvent,
            feedbackEmptyText: eventLabel
                ? tCustomTerm('No feedback for this {{eventLabel}} yet', { eventLabel })
                : i18n.t('No feedback yet'),
            indicatorEmptyText: eventLabel
                ? tCustomTerm('No indicator output for this {{eventLabel}} yet', { eventLabel })
                : i18n.t('No indicator output yet'),
            programRules: programRulesSelector(state),
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
