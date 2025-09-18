import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { connect } from 'react-redux';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';
import type { ReduxAction } from '../../../../capture-core-utils/types';

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateDataEntryField: (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(
            updateDataEntryFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext),
        );
    },
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit, stage, formFoundation, onGetValidationContext));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnit: OrgUnit,
        stage: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(
                successInnerAction,
                dataEntryId,
                itemId,
                programId,
                orgUnit,
                stage,
                formFoundation,
                onGetValidationContext
            );
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export const EnrollmentDataEntry = connect(() => ({}), mapDispatchToProps)(EnrollmentDataEntryComponent);
