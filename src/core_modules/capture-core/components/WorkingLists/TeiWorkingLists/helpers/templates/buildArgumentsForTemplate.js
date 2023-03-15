// @flow
import { v4 as uuid } from 'uuid';
import {
    convertMainFilters,
    convertToTEIFilterAttributes,
    convertToEventFilterQuery,
} from '../TEIFilters/clientConfigToApiTEIFilterQueryConverter';
import type { TeiWorkingListsColumnConfigs, ApiTrackerQueryCriteria } from '../../types';
import type { FiltersData } from '../../../WorkingListsBase';

export const buildArgumentsForTemplate = ({
    filters,
    filtersOnly,
    programStageFiltersOnly,
    columns = [],
    sortById,
    sortByDirection,
    programId,
    programStage,
}: {
    filters?: FiltersData,
    filtersOnly: Array<{ id: string, type: string }>,
    programStageFiltersOnly: Array<{ id: string, type: string }>,
    columns?: TeiWorkingListsColumnConfigs,
    sortById: string,
    sortByDirection: string,
    programId: string,
    programStage?: string,
}) => {
    const { programStatus, occurredAt, enrolledAt, assignedUserMode, assignedUsers } = convertMainFilters({
        filters,
        mainFilters: filtersOnly,
    });
    const { status, eventOccurredAt, scheduledAt } = convertMainFilters({
        filters,
        mainFilters: programStageFiltersOnly,
    });
    const attributeValueFilters = convertToTEIFilterAttributes({
        filters,
        attributeValueFilters: programStage ? columns.filter(column => !column.additionalColumn) : columns,
    });
    const dataFilters = programStage
        ? convertToEventFilterQuery({
            filters,
            mainFilters: programStageFiltersOnly,
            dataElementsValueFilters: columns.filter(column => column.additionalColumn),
        })
        : [];
    const visibleColumnIds: Array<string> = columns.filter(({ visible }) => visible).map(({ id }) => id);
    const criteria: ApiTrackerQueryCriteria = {
        programStatus,
        occurredAt,
        enrolledAt,
        assignedUserMode,
        assignedUsers,
        status,
        eventOccurredAt,
        scheduledAt,
        attributeValueFilters,
        dataFilters,
        order: `${sortById}:${sortByDirection}`,
        displayColumnOrder: visibleColumnIds,
        programStage,
    };
    const data = {
        program: { id: programId },
        programStage: { id: programStage },
        clientId: uuid(),
        sortById,
        sortByDirection,
        filters,
        visibleColumnIds,
    };
    return { data, criteria };
};
