// @flow
import React from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { useDispatch } from 'react-redux';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';
import { getCategoryOptionsValidatorContainers } from './fieldValidators';
import { updateCatCombo, removeCatCombo } from '../../WidgetEnrollmentEventNew/DataEntry/actions/dataEntry.actions';

export const EnrollmentDataEntry = (props) => {
    const dispatch = useDispatch();

    const onUpdateDataEntryField = (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
    ) => {
        dispatch(updateDataEntryFieldBatch(innerAction, programId, orgUnit));
    };

    const onUpdateField = (
        innerAction: ReduxAction<any, any>,
        programId: string,
        orgUnit: OrgUnit,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit));
    };

    const onStartAsyncUpdateField = (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        programId: string,
        orgUnit: OrgUnit,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, dataEntryId, itemId, programId, orgUnit);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEnrollment(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    };

    const onClickCategoryOption = (option: Object, categoryId: string, isValid: boolean) => {
        const value = { [categoryId]: option };
        const { id, itemId } = props;
        const valueMeta = {
            isValid,
            touched: true,
            validationError: !isValid,
        };
        dispatch(updateCatCombo(value, valueMeta, id, itemId));
    };

    const onResetCategoryOption = (categoryId: string) => {
        const { id, itemId } = props;
        const valueMeta = {
            isValid: false,
            touched: true,
            validationError: getCategoryOptionsValidatorContainers()[0].message,
        };
        dispatch(removeCatCombo(categoryId, valueMeta, id, itemId));
    };

    return (<EnrollmentDataEntryComponent
        {...props}
        onUpdateDataEntryField={onUpdateDataEntryField}
        onUpdateField={onUpdateField}
        onStartAsyncUpdateField={onStartAsyncUpdateField}
        onClickCategoryOption={onClickCategoryOption}
        onResetCategoryOption={onResetCategoryOption}
    />);
};
