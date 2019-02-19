// @flow
import { connect } from 'react-redux';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import Enrollment from './Enrollment.component';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        extraActions: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
        },
        programId: string,
        orgUnitId: string,
    ) => {
        dispatch(updateFieldBatch(innerAction, extraActions, programId, orgUnitId));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        extraActions: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>
        },
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnitId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, extraActions, dataEntryId, itemId, programId, orgUnitId);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Enrollment);

