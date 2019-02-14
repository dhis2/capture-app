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
    updateFieldBatch,
    asyncUpdateSuccessBatch,
} from './actions/dataEntry.actionBatchs';
import {
    requestSaveNewEnrollmentAndReturnToMainPage,
    startAsyncUpdateFieldForNewEnrollment,
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
    onUpdateField: (innerAction: ReduxAction<any, any>, extraActions: { filterActions: Array<ReduxAction<any, any>>, filterActionsToBeExecuted: Array<ReduxAction<any, any>>}) => {
        dispatch(updateFieldBatch(innerAction, extraActions));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        extraActions: { filterActions: Array<ReduxAction<any, any>>, filterActionsToBeExecuted: Array<ReduxAction<any, any>>},
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, extraActions, dataEntryId, itemId);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
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
