// @flow
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as viewEventSelectorActionTypes,
} from '../../Pages/ViewEvent/ViewEventSelector/ViewEventSelector.actions';
import {
    actionTypes as newEventSelectorActionTypes,
} from '../../Pages/NewEvent/SelectorLevel/selectorLevel.actions';

import {
    resetCategoriesAfterSettingOrgUnit,
    skipCategoriesResetAfterSettingOrgUnit,
} from '../actions/crossPage.actions';

import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';


async function isOptionAssociatedWithOrganisationUnit(categoryOptionId: string, orgUnitId: string) {
    const categoryOption = await getUserStorageController().get(userStores.CATEGORY_OPTIONS, categoryOptionId);
    if (!categoryOption.organisationUnits) {
        return true;
    }

    return !!categoryOption.organisationUnits[orgUnitId];
}

export const resetCategoriesAfterSettingOrgUnitIfApplicableEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$
        .ofType(
            mainPageSelectorActionTypes.SET_ORG_UNIT,
            editEventSelectorActionTypes.SET_ORG_UNIT,
            viewEventSelectorActionTypes.SET_ORG_UNIT,
            newEventSelectorActionTypes.SET_ORG_UNIT,
        )
        .switchMap((action) => {
            const orgUnitId = action.payload.id;
            const selectedCategories = store.getState().currentSelections.categories;
            if (!selectedCategories) {
                return Promise.resolve(skipCategoriesResetAfterSettingOrgUnit(action.type));
            }

            const isAssociatedPromises = Object
                .keys(selectedCategories)
                .map((categoryId) => {
                    const categoryOptionId = selectedCategories[categoryId];
                    return isOptionAssociatedWithOrganisationUnit(categoryOptionId, orgUnitId)
                        .then(isAssociated => ({
                            id: categoryOptionId,
                            isAssociated,
                        }));
                });

            return Promise
                .all(isAssociatedPromises)
                .then((associatedContainers) => {
                    const notAssociated = associatedContainers
                        .filter(container => !container.isAssociated)
                        .map(container => container.id);

                    if (notAssociated.length <= 0) {
                        return Promise.resolve(skipCategoriesResetAfterSettingOrgUnit(action.type));
                    }

                    return resetCategoriesAfterSettingOrgUnit(notAssociated, action.type);
                });
        });

