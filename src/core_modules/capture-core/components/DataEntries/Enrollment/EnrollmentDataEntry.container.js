// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { connect } from 'react-redux';
import { ProgramStage, RenderFoundation } from '../../../metaData';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateDataEntryField: (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => Object,
    ) => {
        dispatch(
            updateDataEntryFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext),
        );
    },
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => Object,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnit: OrgUnit,
        stage?: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => Object,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, dataEntryId, itemId, programId, orgUnit, stage, formFoundation, onGetValidationContext);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

// $FlowFixMe
export const EnrollmentDataEntry = connect(() => ({}), mapDispatchToProps)(EnrollmentDataEntryComponent);

