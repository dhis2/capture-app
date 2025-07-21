import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { connect } from 'react-redux';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateDataEntryField: (
        innerAction: any,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage | undefined,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(
            updateDataEntryFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext),
        );
    },
    onUpdateField: (
        innerAction: any,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage | undefined,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext));
    },
    onStartAsyncUpdateField: (
        innerAction: any,
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage | undefined,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: any) =>
            asyncUpdateSuccessBatch(successInnerAction, dataEntryId, itemId, programId, orgUnit, stage, formFoundation, onGetValidationContext);
        const onAsyncUpdateError = (errorInnerAction: any) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export const EnrollmentDataEntry = connect(() => ({}), mapDispatchToProps)(EnrollmentDataEntryComponent);
