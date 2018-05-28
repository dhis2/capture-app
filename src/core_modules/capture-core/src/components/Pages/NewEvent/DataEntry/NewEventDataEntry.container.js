// @flow
import { connect } from 'react-redux';
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../../utils/errorCreator';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import NewEventDataEntry from './NewEventDataEntry.component';
import {
    startRunRulesOnUpdateForNewSingleEvent,
    startSaveNewEventAndReturnToMainPage,
    cancelNewEventAndReturnToMainPage,
} from './newEventDataEntry.actions';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';

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
    ready: !state.newEventPage.dataEntryIsLoading,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            innerAction,
            startRunRulesOnUpdateForNewSingleEvent(innerAction.payload),
        ], 'UpdateFieldActionsBatch'));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(startSaveNewEventAndReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(cancelNewEventAndReturnToMainPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(NewEventDataEntry),
);
