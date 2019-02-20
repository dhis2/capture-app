// @flow
import { connect } from 'react-redux';
import { RenderFoundation } from '../../../../metaData';
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

    const mapStateToProps = (state: ReduxState, props: Object) => ({
        ready: !state.newEnrollmentPage.dataEntryIsLoading,
        error: state.newEnrollmentPage.dataEntryError,
        programName: programNameSelector(state),
        orgUnitName: state.organisationUnits[state.currentSelections.orgUnitId] &&
            state.organisationUnits[state.currentSelections.orgUnitId].name,
    });

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSave: (itemId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveNewEnrollmentAndReturnToMainPage(dataEntryId, itemId, formFoundation));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ margin: 4 }))(
        withErrorMessageHandler()(DataEntry),
    ),
);
