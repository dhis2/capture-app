// @flow
import { useMemo } from 'react';
import type { TeiWorkingListsColumnConfigs } from '../../types';
import type { FiltersOnly } from '../../../../ListView';

export const useFiltersToKeep = (
    columns: TeiWorkingListsColumnConfigs,
    filters: Object,
    filtersOnly: FiltersOnly,
    programStageFiltersOnly: FiltersOnly,
) =>
    useMemo(() => {
        if (filters) {
            const filtersListToKeep = [
                ...columns,
                ...filtersOnly,
                // $FlowFixMe[prop-missing]
                ...programStageFiltersOnly.filter(filterOnly => filterOnly.mainButton),
            ].map(({ id }) => id);

            const filtersObjectToKeep = Object.entries(filters).reduce(
                (acc, [key, value]) => (filtersListToKeep.includes(key) ? { ...acc, [key]: value } : acc),
                {},
            );
            return filtersObjectToKeep;
        }
        return {};
    }, [columns, filtersOnly, programStageFiltersOnly, filters]);
