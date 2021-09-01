// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SELECTIONS_COMPLETENESS_CALCULATE: 'CrossPage.SelectionsCompletenessCalculate',
    AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET: 'CrossPage.AfterSettingOrgUnitSkipCategoriesReset',
    AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET: 'CrossPage.AfterSettingOrgUnitDoCategoriesReset',
    UPDATE_SHOW_ACCESSIBLE_STATUS: 'currentSelections.UpdateShowAccessibleStatus',
};

export const calculateSelectionsCompleteness =
    (isComplete: boolean, triggeringActionType: string) =>
        actionCreator(actionTypes.SELECTIONS_COMPLETENESS_CALCULATE)({ isComplete, triggeringActionType });

export const updateShowAccessibleStatus = (newStatus: boolean) =>
    actionCreator(actionTypes.UPDATE_SHOW_ACCESSIBLE_STATUS)({ newStatus });

export const skipCategoriesResetAfterSettingOrgUnit =
    (triggeringActionType: string) =>
        actionCreator(actionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET)({ triggeringActionType });

export const resetCategoriesAfterSettingOrgUnit =
    (resetCategories: Array<string>, triggeringActionType: string) =>
        actionCreator(actionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET)(
            { resetCategories, triggeringActionType });
