import { useMemo } from 'react';
import type { TrackerWorkingListsColumnConfigs } from '../../types';
import type { FiltersOnly } from '../../../../ListView';

export const useFiltersToKeep = (
    columns: TrackerWorkingListsColumnConfigs,
    filters: any,
    filtersOnly: FiltersOnly,
    programStageFiltersOnly: FiltersOnly,
) =>
    useMemo(() => {
        if (filters) {
            const filtersListToKeep = [
                ...columns,
                ...filtersOnly,
                ...programStageFiltersOnly.filter(filterOnly => 'mainButton' in filterOnly && filterOnly.mainButton),
            ].map(({ id }) => id);

            const filtersObjectToKeep = Object.entries(filters).reduce(
                (acc, [key, value]) => (filtersListToKeep.includes(key) ? { ...acc, [key]: value } : acc),
                {},
            );
            return filtersObjectToKeep;
        }
        return {};
    }, [columns, filtersOnly, programStageFiltersOnly, filters]);
