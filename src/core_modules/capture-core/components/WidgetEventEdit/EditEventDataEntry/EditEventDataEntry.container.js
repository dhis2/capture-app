// @flow
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import { statusTypes } from 'capture-core/events/statusTypes';
import { batchActions } from 'redux-batched-actions';
import { dataEntryKeys } from 'capture-core/constants';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { EditEventDataEntryComponent } from './EditEventDataEntry.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import {
    startAsyncUpdateFieldForEditEvent,
    startRunRulesOnUpdateForEditSingleEvent,
    batchActionTypes,
} from '../DataEntry/editEventDataEntry.actions';
import { type RenderFoundation } from '../../../metaData';

import {
    setCurrentDataEntry, startRunRulesPostUpdateField,
} from '../../DataEntry/actions/dataEntry.actions';
import {
    requestSaveEditEventDataEntry,
    cancelEditEventDataEntry,
    requestDeleteEventDataEntry,
    startCreateNewAfterCompleting,
    requestSaveAndCompleteEnrollment,
} from './editEventDataEntry.actions';

import { getLocationQuery } from '../../../utils/routing/getLocationQuery';

const mapStateToProps = (state: ReduxState, props) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const itemId = state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;

    const dataEntryKey = `${props.dataEntryId}-${itemId}`;
    const isCompleted = state.dataEntriesFieldsValue[dataEntryKey]?.complete === 'true';

    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
        itemId,
        isCompleted,
        enrolledAt: state.enrollmentDomain?.enrollment?.enrolledAt,
        occurredAt: state.enrollmentDomain?.enrollment?.occurredAt,
        eventData: state.enrollmentDomain?.enrollment?.events,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, props): any => ({
    onUpdateDataEntryField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();
        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForEditSingleEvent({ ...innerAction.payload, uid, orgUnit, programId }),
        ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH));
    },
    onUpdateField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForEditSingleEvent({ ...innerAction.payload, uid, orgUnit, programId }),
        ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH));
    },
    onStartAsyncUpdateField: (orgUnit: OrgUnit, programId: string) => (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            return batchActions(
                [
                    successInnerAction,
                    startRunRulesPostUpdateField(dataEntryId, itemId, uid),
                    startRunRulesOnUpdateForEditSingleEvent({
                        ...successInnerAction.payload,
                        dataEntryId,
                        itemId,
                        uid,
                        orgUnit,
                        programId,
                    }),
                ],
                batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH,
            );
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForEditEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
    onSave: () => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        const { onSaveExternal } = props;
        window.scrollTo(0, 0);
        onSaveExternal && onSaveExternal();
        dispatch(requestSaveEditEventDataEntry(eventId, dataEntryId, formFoundation));
    },
    onSaveAndCompleteEnrollment: () => (
        eventId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        enrollment: Object,
    ) => {
        const {
            onSaveAndCompleteEnrollmentExternal,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
        } = props;
        dispatch(
            requestSaveAndCompleteEnrollment({
                itemId: eventId,
                dataEntryId,
                formFoundation,
                onSaveAndCompleteEnrollmentExternal,
                onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveAndCompleteEnrollmentErrorActionType,
                enrollment,
            }),
        );
    },
    onCancel: () => {
        const { eventStatus, onCancelEditEvent } = props;
        const isScheduled = eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE;
        window.scrollTo(0, 0);

        dispatch(batchActions([
            cancelEditEventDataEntry(),
            ...(isScheduled ? [] : [setCurrentDataEntry(props.dataEntryId, dataEntryKeys.VIEW)]),
        ]));
        onCancelEditEvent && onCancelEditEvent(isScheduled);
    },
    onDelete: () => {
        const { enrollmentId } = props;
        const { eventId } = getLocationQuery();
        dispatch(requestDeleteEventDataEntry({ eventId, enrollmentId }));
    },
    onCancelCreateNew: (itemId: string) => {
        const { dataEntryId, formFoundation, orgUnit, enrollmentId, programId, teiId, availableProgramStages } = props;
        dispatch(requestSaveEditEventDataEntry(itemId, dataEntryId, formFoundation));
        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew: false, orgUnitId: orgUnit.id, programId, teiId, availableProgramStages,
        }));
    },
    onConfirmCreateNew: (itemId: string) => {
        const { dataEntryId, formFoundation, orgUnit, enrollmentId, programId, teiId, availableProgramStages } = props;
        dispatch(requestSaveEditEventDataEntry(itemId, dataEntryId, formFoundation));
        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew: true, orgUnitId: orgUnit.id, programId, teiId, availableProgramStages,
        }));
    },
});

// $FlowFixMe[missing-annot] automated comment
export const EditEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(EditEventDataEntryComponent),
);
