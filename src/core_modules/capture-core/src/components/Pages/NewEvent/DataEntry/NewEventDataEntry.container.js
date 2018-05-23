// @flow
import { connect } from 'react-redux';
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../../utils/errorCreator';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import NewEventDataEntry from './NewEventDataEntry.component';
import { startRunRulesOnUpdateForNewSingleEvent, startSaveNewEventAndReturnToMainPage } from './newEventDataEntry.actions';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

const getFormFoundation = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator('programId not found')({ method: 'getFormFoundation' }));
        return null;
    }

    const foundation = program.getStage();
    if (!foundation) {
        log.error(errorCreator('stage not found for program')({ method: 'getFormFoundation' }));
        return null;
    }

    return foundation;
}

const mapStateToProps = (state: ReduxState) => ({
    formFoundation: getFormFoundation(state),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            innerAction,
            startRunRulesOnUpdateForNewSingleEvent(innerAction.payload),
        ], 'UpdateFieldActionsBatch'));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        dispatch(startSaveNewEventAndReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewEventDataEntry);
