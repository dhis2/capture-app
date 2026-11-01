import { connect } from 'react-redux';
import type { ReduxAction } from 'capture-core-utils/types';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';

const mapStateToProps = (state: any, props: { id: string }) => {
    const itemId = state.dataEntries[props.id]?.itemId;
    const dataEntryKey = `${props.id}-${itemId}`;
    return {
        orgUnitFieldValue: state.dataEntriesFieldsValue[dataEntryKey]?.orgUnit,
        stageOrgUnitFieldValue: state.dataEntriesFieldsValue[dataEntryKey]?.stageOrgUnit,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateDataEntryField: (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        stage: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(
            updateDataEntryFieldBatch(innerAction, programId, stage, formFoundation, onGetValidationContext),
        );
    },
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        programId: string,
        stage: ProgramStage,
        formFoundation: RenderFoundation,
        onGetValidationContext: () => any,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, stage, formFoundation, onGetValidationContext));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        programId: string,
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
                stage,
                formFoundation,
                onGetValidationContext,
            );
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export const EnrollmentDataEntry = connect(mapStateToProps, mapDispatchToProps)(EnrollmentDataEntryComponent);
