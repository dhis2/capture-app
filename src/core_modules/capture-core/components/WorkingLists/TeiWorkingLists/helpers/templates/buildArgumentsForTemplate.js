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

const buildArguments = ({
    filters,
    programStageFiltersOnly,
    columns,
    programStageId,
    mainFiltersConverted,
}: {
    filters?: FiltersData,
    programStageFiltersOnly: Array<{ id: string, type: string }>,
    columns: TeiWorkingListsColumnConfigs,
    programStageId?: string,
    mainFiltersConverted: Object,
}) => {
    if (!programStageId) {
        return {
            assignedUserMode: mainFiltersConverted.assignedUserMode,
            assignedUsers: mainFiltersConverted.assignedUsers,
            attributesColumns: columns,
            dataFilters: [],
            status: undefined,
            eventOccurredAt: undefined,
            scheduledAt: undefined,
        };
    }

    const additionalFiltersConverted = convertMainFilters({
        filters,
        mainFilters: programStageFiltersOnly,
    });
    const { status, eventOccurredAt, scheduledAt } = additionalFiltersConverted;
    return {
        status,
        eventOccurredAt,
        scheduledAt,
        assignedUserMode: additionalFiltersConverted.assignedUserMode,
        assignedUsers: additionalFiltersConverted.assignedUsers,
        attributesColumns: columns.filter(column => !column.additionalColumn),
        dataFilters: convertToEventFilterQuery({
            filters,
            mainFilters: programStageFiltersOnly,
            dataElementsValueFilters: columns.filter(column => column.additionalColumn),
        }),
    };
};

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
    const mainFiltersConverted = convertMainFilters({
        filters,
        mainFilters: filtersOnly,
    });
    const { programStatus, occurredAt, enrolledAt, followUp } = mainFiltersConverted;
    const { assignedUserMode, assignedUsers, attributesColumns, dataFilters, status, eventOccurredAt, scheduledAt } =
        buildArguments({
            filters,
            programStageFiltersOnly,
            columns,
            programStageId,
            mainFiltersConverted,
        });
    const attributeValueFilters = convertToTEIFilterAttributes({ filters, attributeValueFilters: attributesColumns });
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
