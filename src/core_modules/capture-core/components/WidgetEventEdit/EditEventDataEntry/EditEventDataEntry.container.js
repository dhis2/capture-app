// @flow
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { statusTypes } from 'capture-core/events/statusTypes';
import { batchActions } from 'redux-batched-actions';
import { dataEntryKeys } from 'capture-core/constants';
import type { OrgUnit } from 'rules-engine';
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
} from './editEventDataEntry.actions';

import { getLocationQuery } from '../../../utils/routing/getLocationQuery';


const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
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
    onSave: (orgUnit: OrgUnit) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveEditEventDataEntry(eventId, dataEntryId, formFoundation, orgUnit));
    },
    onCancel: () => {
        const { eventStatus, onCancelEditEvent } = props;
        const isScheduled = eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE;
        window.scrollTo(0, 0);

        dispatch(batchActions([
            cancelEditEventDataEntry(),
            ...(isScheduled ? [] : [setCurrentDataEntry(props.dataEntryId, dataEntryKeys.VIEW)]),
        ]));
        isScheduled && onCancelEditEvent && onCancelEditEvent();
    },
    onDelete: () => {
        const { enrollmentId } = props;
        const { eventId } = getLocationQuery();
        dispatch(requestDeleteEventDataEntry({ eventId, enrollmentId }));
    },
});

// $FlowFixMe[missing-annot] automated comment
export const EditEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(EditEventDataEntryComponent),
);