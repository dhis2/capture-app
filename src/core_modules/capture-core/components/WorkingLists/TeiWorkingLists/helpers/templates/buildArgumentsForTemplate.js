// @flow
import { v4 as uuid } from 'uuid';
import {
    convertMainFilters,
    convertToTEIFilterAttributes,
    convertToEventFilterQuery,
} from '../TEIFilters/clientConfigToApiTEIFilterQueryConverter';
import type { TeiWorkingListsColumnConfigs, ApiTrackerQueryCriteria } from '../../types';
import type { FiltersData } from '../../../WorkingListsBase';
import { getOrderQueryArgs } from '../../epics';

export const buildArgumentsForTemplate = ({
    filters,
    filtersOnly,
    programStageFiltersOnly,
    columns = [],
    sortById,
    sortByDirection,
    programId,
    programStageId,
}: {
    filters?: FiltersData,
    filtersOnly: Array<{ id: string, type: string }>,
    programStageFiltersOnly: Array<{ id: string, type: string }>,
    columns?: TeiWorkingListsColumnConfigs,
    sortById: string,
    sortByDirection: string,
    programId: string,
    programStageId?: string,
}) => {
    const { programStatus, occurredAt, enrolledAt, assignedUserMode, assignedUsers, followUp } = convertMainFilters({
        filters,
        mainFilters: filtersOnly,
    });
    const { status, eventOccurredAt, scheduledAt } = convertMainFilters({
        filters,
        mainFilters: programStageFiltersOnly,
    });
    const attributeValueFilters = convertToTEIFilterAttributes({
        filters,
        attributeValueFilters: programStageId ? columns.filter(column => !column.additionalColumn) : columns,
    });
    const dataFilters = programStageId
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
        followUp,
        eventOccurredAt,
        scheduledAt,
        attributeValueFilters,
        dataFilters,
        order: getOrderQueryArgs({ sortById, sortByDirection }),
        displayColumnOrder: visibleColumnIds,
        programStage: programStageId,
    };
    const data = {
        program: { id: programId },
        programStage: { id: programStageId },
        clientId: uuid(),
        sortById,
        sortByDirection,
        filters,
        visibleColumnIds,
    };
    return { data, criteria };
};
