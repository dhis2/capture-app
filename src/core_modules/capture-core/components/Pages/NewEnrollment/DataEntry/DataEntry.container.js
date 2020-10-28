// @flow
import { connect } from 'react-redux';
import { type RenderFoundation } from '../../../../metaData';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import DataEntry from './DataEntry.component';
import {
    makeProgramNameSelector,
} from './dataEntry.selectors';
import {
    requestSaveNewEnrollmentAndReturnToMainPage,
} from './actions/dataEntry.actions';

const makeMapStateToProps = () => {
    const programNameSelector = makeProgramNameSelector();

    const mapStateToProps = (state: ReduxState) => ({
        ready: !state.newEnrollmentPage.dataEntryIsLoading,
        error: state.newEnrollmentPage.dataEntryError,
        programName: programNameSelector(state),
        orgUnitName: state.organisationUnits[state.currentSelections.orgUnitId] &&
            state.organisationUnits[state.currentSelections.orgUnitId].name,
    });


    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSave: (itemId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveNewEnrollmentAndReturnToMainPage(dataEntryId, itemId, formFoundation));
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ margin: 4 }))(
        withErrorMessageHandler()(DataEntry),
    ),
);
