// @flow
import { connect } from 'react-redux';
import log from 'loglevel';
import EditEventDataEntry from './EditEventDataEntry.component';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import errorCreator from '../../../../utils/errorCreator';

const getFormFoundation = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator('programId not found')({ method: 'getFormFoundation' }));
        return null;
    }

    // $FlowSuppress
    const foundation = program.getStage();
    if (!foundation) {
        log.error(errorCreator('stage not found for program')({ method: 'getFormFoundation' }));
        return null;
    }

    return foundation;
};

const mapStateToProps = (state: ReduxState) => ({
    formFoundation: getFormFoundation(state),
    ready: !state.editEventPage.dataEntryIsLoading,
    error: state.editEventPage.dataEntryLoadError,
});

// $FlowSuppress
export default connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(EditEventDataEntry)));
