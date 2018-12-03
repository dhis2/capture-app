// @flow
import { connect } from 'react-redux';
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import EditEventDataEntry from './EditEventDataEntry.component';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import errorCreator from '../../../../utils/errorCreator';
import {
    startAsyncUpdateFieldForEditEvent,
    startRunRulesOnUpdateForEditSingleEvent,
    requestSaveReturnToMainPage,
    startCancelSaveReturnToMainPage,
    requestAddNoteForEditSingleEvent,
    batchActionTypes,
} from './editEventDataEntry.actions';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

const getFormFoundation = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator('programId not found')({ method: 'getFormFoundation' }));
        return null;
    }

    // $FlowSuppress
    const stage = program.getStage();
    if (!stage) {
        log.error(errorCreator('stage not found for program')({ method: 'getFormFoundation' }));
        return null;
    }

    return stage.stageForm;
};

const mapStateToProps = (state: ReduxState) => ({
    formFoundation: getFormFoundation(state),
    ready: !state.editEventPage.dataEntryIsLoading,
    error: state.editEventPage.dataEntryLoadError,
});

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
        dispatch(requestSaveReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(startCancelSaveReturnToMainPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(withErrorMessageHandler()(EditEventDataEntry)),
);
