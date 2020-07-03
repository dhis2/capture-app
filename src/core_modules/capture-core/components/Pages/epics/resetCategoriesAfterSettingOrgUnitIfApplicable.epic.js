// @flow
import {
    resetCategoriesAfterSettingOrgUnit,
    skipCategoriesResetAfterSettingOrgUnit,
} from '../actions/crossPage.actions';

import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';
import { lockedSelectorActionTypes } from '../../LockedSelector';


async function isOptionAssociatedWithOrganisationUnit(categoryOptionId: string, orgUnitId: string) {
    const categoryOption = await getUserStorageController().get(userStores.CATEGORY_OPTIONS, categoryOptionId);
    if (!categoryOption.organisationUnits) {
        return true;
    }

    return !!categoryOption.organisationUnits[orgUnitId];
}

export const resetCategoriesAfterSettingOrgUnitIfApplicableEpic = (action$: InputObservable, store: ReduxStore) =>
    action$
       
        // $FlowFixMe[prop-missing] automated comment
        .ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET)
        .switchMap((action) => {
            const orgUnitId = action.payload.id;
            const selectedCategories = store.getState().currentSelections.categories;
            if (!selectedCategories) {
                return Promise.resolve(skipCategoriesResetAfterSettingOrgUnit(action.type));
            }

            const categoriesWithValue = Object
                .keys(selectedCategories)
                .reduce((acc, categoryId) => {
                    if (selectedCategories[categoryId]) {
                        acc[categoryId] = selectedCategories[categoryId];
                    }
                    return acc;
                }, {});

            const isAssociatedPromises = Object
                .keys(categoriesWithValue)
                .map((categoryId) => {
                    const categoryOptionId = categoriesWithValue[categoryId];
                    return isOptionAssociatedWithOrganisationUnit(categoryOptionId, orgUnitId)
                        .then(isAssociated => ({
                            id: categoryId,
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

