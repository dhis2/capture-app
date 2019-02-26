// @flow
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
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';

import {
    setCurrentDataEntry,
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
        ready: !state.viewEventPage.dataEntryIsLoading && !eventDetailsSection.loading,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            innerAction,
            startRunRulesOnUpdateForEditSingleEvent(innerAction.payload),
        ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH));
    },
    onAddNote: (itemId: string, dataEntryId: string, note: string) => {
        dispatch(requestAddNoteForEditSingleEvent(itemId, dataEntryId, note));
    },
    onStartAsyncUpdateField: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        dataEntryId: string,
        itemId: string,
    ) => {
        dispatch(startAsyncUpdateFieldForEditEvent(
            fieldId,
            fieldLabel,
            formBuilderId,
            formId,
            callback,
            dataEntryId,
            itemId));
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

export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(EditEventDataEntry),
);
