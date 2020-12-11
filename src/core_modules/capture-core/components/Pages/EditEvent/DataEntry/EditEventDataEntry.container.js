// @flow
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import EditEventDataEntry from './EditEventDataEntry.component';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import {
  startAsyncUpdateFieldForEditEvent,
  startRunRulesOnUpdateForEditSingleEvent,
  requestSaveReturnToMainPage,
  startCancelSaveReturnToMainPage,
  requestAddNoteForEditSingleEvent,
  batchActionTypes,
} from './editEventDataEntry.actions';
import { startRunRulesPostUpdateField } from '../../../DataEntry';
import { type RenderFoundation } from '../../../../metaData';

const getFormFoundation = (state: ReduxState) => {
  const { programId } = state.currentSelections;
  const program = programCollection.get(programId);
  if (!program) {
    log.error(
      errorCreator('programId not found')({
        method: 'getFormFoundation',
      }),
    );
    return null;
  }

  // $FlowFixMe[prop-missing] automated comment
  const { stage } = program;
  if (!stage) {
    log.error(
      errorCreator('stage not found for program')({
        method: 'getFormFoundation',
      }),
    );
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
  onUpdateDataEntryField: (innerAction: ReduxAction<any, any>) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    dispatch(
      batchActions(
        [
          innerAction,
          startRunRulesPostUpdateField(dataEntryId, itemId, uid),
          startRunRulesOnUpdateForEditSingleEvent({
            ...innerAction.payload,
            uid,
          }),
        ],
        batchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH,
      ),
    );
  },
  onUpdateField: (innerAction: ReduxAction<any, any>) => {
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    dispatch(
      batchActions(
        [
          innerAction,
          startRunRulesPostUpdateField(dataEntryId, itemId, uid),
          startRunRulesOnUpdateForEditSingleEvent({
            ...innerAction.payload,
            uid,
          }),
        ],
        batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH,
      ),
    );
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
      return batchActions(
        [
          successInnerAction,
          startRunRulesPostUpdateField(dataEntryId, itemId, uid),
          startRunRulesOnUpdateForEditSingleEvent({
            ...successInnerAction.payload,
            dataEntryId,
            itemId,
            uid,
          }),
        ],
        batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH,
      );
    };
    const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

    dispatch(
      startAsyncUpdateFieldForEditEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError),
    );
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
// $FlowFixMe[missing-annot] automated comment
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLoadingIndicator()(withErrorMessageHandler()(EditEventDataEntry)));
