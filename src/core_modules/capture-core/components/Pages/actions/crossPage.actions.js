// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SELECTIONS_COMPLETENESS_CALCULATED: 'SelectionsCompletenessCalculated',
    AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET: 'AfterSettingOrgUnitSkipCategoriesReset',
    AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET: 'AfterSettingOrgUnitDoCategoriesReset',
};

export const selectionsCompletenessCalculated =
    (isComplete: boolean, triggeringActionType: string) =>
        actionCreator(actionTypes.SELECTIONS_COMPLETENESS_CALCULATED)({ isComplete, triggeringActionType });

export const skipCategoriesResetAfterSettingOrgUnit =
    (triggeringActionType: string) =>
        actionCreator(actionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET)({ triggeringActionType });

export const resetCategoriesAfterSettingOrgUnit =
    (resetCategories: Array<string>, triggeringActionType: string) =>
        actionCreator(actionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET)(
            { resetCategories, triggeringActionType });
