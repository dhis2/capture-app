// @flow
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import EditEventDataEntry from './EditEventDataEntry.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import {
    startAsyncUpdateFieldForEditEvent,
    startRunRulesOnUpdateForEditSingleEvent,
    requestAddNoteForEditSingleEvent,
    batchActionTypes,
} from '../../../EditEvent/DataEntry/editEventDataEntry.actions';
import { RenderFoundation } from '../../../../../metaData';

import {
    setCurrentDataEntry, startRunRulesPostUpdateField,
} from '../../../../DataEntry/actions/dataEntry.actions';

import {
    requestSaveEditEventDataEntry,
    cancelEditEventDataEntry,
} from './editEventDataEntry.actions';

import {
    viewEventIds,
} from '../eventDetails.actions';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onUpdateDataEntryField: (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();
        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForEditSingleEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH));
    },
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForEditSingleEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH));
    },
    onAddNote: (itemId: string, dataEntryId: string, note: string) => {
        dispatch(requestAddNoteForEditSingleEvent(itemId, dataEntryId, note));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            return batchActions([
                successInnerAction,
                startRunRulesPostUpdateField(dataEntryId, itemId, uid),
                startRunRulesOnUpdateForEditSingleEvent({ ...successInnerAction.payload, dataEntryId, itemId, uid }),
            ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForEditEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveEditEventDataEntry(eventId, dataEntryId, formFoundation));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(batchActions([
            cancelEditEventDataEntry(),
            setCurrentDataEntry(viewEventIds.dataEntryId, viewEventIds.itemId),
        ]));
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(EditEventDataEntry),
);
