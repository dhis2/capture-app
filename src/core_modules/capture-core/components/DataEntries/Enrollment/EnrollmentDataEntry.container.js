// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { connect } from 'react-redux';
import { ProgramStage } from '../../../metaData';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';

const mapStateToProps = ({ useNewDashboard }) => ({
    newDashboardConfig: useNewDashboard,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateDataEntryField: (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
    ) => {
        dispatch(updateDataEntryFieldBatch(innerAction, programId, orgUnit, stage));
    },
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit, stage));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, dataEntryId, itemId, programId, orgUnit, stage);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

// $FlowFixMe
export const EnrollmentDataEntry = connect(mapStateToProps, mapDispatchToProps)(EnrollmentDataEntryComponent);

