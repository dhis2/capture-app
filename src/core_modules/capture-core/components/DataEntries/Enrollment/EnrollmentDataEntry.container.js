// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { connect } from 'react-redux';
import { updateFieldBatch, asyncUpdateSuccessBatch, updateDataEntryFieldBatch } from './actions/enrollment.actionBatchs';
import { startAsyncUpdateFieldForNewEnrollment } from './actions/enrollment.actions';
import { EnrollmentDataEntryComponent } from './EnrollmentDataEntry.component';
import { getCategoryOptionsValidatorContainers } from './fieldValidators';
import { updateCatCombo, removeCatCombo } from '../../WidgetEnrollmentEventNew/DataEntry/actions/dataEntry.actions';
import type { CategoryOption } from '../../FormFields/New/CategoryOptions/CategoryOptions.types';
import { getProgramThrowIfNotFound } from '../../../metaData';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const { stages, categoryCombinationForm } = getProgramThrowIfNotFound(props.programId);

    /**
     * Show AOC selection ONLY if there are any program stages in the program with:
        “Auto-generate event” and NOT “Open data entry form after enrollment”.
     */
    const shouldShowAOC = [...stages.values()].some(stage => stage.autoGenerateEvent && !stage.openAfterEnrollment);

    const { attributeCategoryOptions } = state.dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || {};
    return { shouldShowAOC, stateCategoryOptions: attributeCategoryOptions, categoryCombinationForm };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, props) => ({
    onUpdateDataEntryField: (
        innerAction: ReduxAction<any, any>,
        data: any,
        programId: string,
        orgUnit: OrgUnit,
    ) => {
        dispatch(updateDataEntryFieldBatch(innerAction, programId, orgUnit));
    },
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        programId: string,
        orgUnit: OrgUnit,
    ) => {
        dispatch(updateFieldBatch(innerAction, programId, orgUnit));
    },
    onStartAsyncUpdateField: (
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
    },
    onClickCategoryOption: (option: CategoryOption, categoryId: string, isValid: boolean) => {
        const value = { [categoryId]: option };
        const { id, itemId } = props;
        const valueMeta = {
            isValid,
            touched: true,
            validationError: !isValid,
        };
        dispatch(updateCatCombo(value, valueMeta, id, itemId));
    },
    onResetCategoryOption: (categoryId: string) => {
        const { id, itemId } = props;
        const valueMeta = {
            isValid: false,
            touched: true,
            validationError: getCategoryOptionsValidatorContainers()[0].message,
        };
        dispatch(removeCatCombo(categoryId, valueMeta, id, itemId));
    },
});

// $FlowFixMe
export const EnrollmentDataEntry = connect(mapStateToProps, mapDispatchToProps)(EnrollmentDataEntryComponent);

