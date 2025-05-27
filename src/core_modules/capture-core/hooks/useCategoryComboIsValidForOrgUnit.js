// @flow
import { useMemo } from 'react';
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';
import { useIndexedDBQuery } from '../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../storageControllers';

type Props = {
    selectedOrgUnitId: string,
}

const getSelectedCategoryOption = (selectedCategories: Array<string>) => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.CATEGORY_OPTIONS, {
        predicate: ({ id, organisationUnits }) => selectedCategories.includes(id) && organisationUnits,
    });
};

export const useCategoryOptionIsValidForOrgUnit = ({
    selectedOrgUnitId,
}: Props) => {
    const { categories, complete } = useSelector(({ currentSelections }) => ({
        categories: currentSelections.categories,
        complete: currentSelections.complete,
    }), shallowEqual);

    const categoryOptionIds = categories && Object.values(categories);

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['categoryOptions', categoryOptionIds],
        () => getSelectedCategoryOption(categoryOptionIds),
        {
            enabled: complete && selectedOrgUnitId && !!categoryOptionIds && categoryOptionIds.length > 0,
        },
    );

    const categoryOptionIsInvalidForOrgUnit = useMemo(() => {
        if (!data || !data.length) {
            return false;
        }

        return data.every(({ organisationUnits }) => !organisationUnits[selectedOrgUnitId]);
    }, [data, selectedOrgUnitId]);

    return {
        categoryOptionIsInvalidForOrgUnit,
        isLoading,
        isError,
    };
};

