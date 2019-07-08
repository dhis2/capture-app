// @flow
import i18n from '@dhis2/d2-i18n';
import {
    getBooleanFilterData,
    getDateFilterData,
    getMultiSelectOptionSetFilterData,
    getSingleSelectOptionSetFilterData,
    getNumericFilterData,
    getTextFilterData,
    getTrueOnlyFilterData,
} from '../components/FiltersForTypes';
import { dataElementTypes as elementTypes, DataElement, RenderFoundation, OptionSet, Option } from '../metaData';
import eventStatusElement from '../events/eventStatusElement';
import {
    MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS,
} from '../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.const';

const getNumericFilter = (filter: Object) => ({
    ge: filter.min,
    le: filter.max,
});

const getBooleanFilter = (filter: Object) => ({
    in: (filter || []),
});

const getMultiSelectOptionSetFilter = (filter: Object) => ({
    in: (filter || []),
});

const getSingleSelectOptionSetFilter = (filter: Object) => ({
    eq: filter,
});

const getTrueOnlyFilter = (filter: Object) => ({
    in: (filter || []),
});

const getTextFilter = (filter: Object) => ({
    like: filter,
});

const getDateFilter = (filter: Object) => ({
    period: filter.main,
    ge: filter.from,
    le: filter.to,
});

const getFilterByType = {
    [elementTypes.TEXT]: getTextFilter,
    [elementTypes.NUMBER]: getNumericFilter,
    [elementTypes.INTEGER]: getNumericFilter,
    [elementTypes.INTEGER_POSITIVE]: getNumericFilter,
    [elementTypes.INTEGER_NEGATIVE]: getNumericFilter,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [elementTypes.DATE]: getDateFilter,
    [elementTypes.BOOLEAN]: getBooleanFilter,
    [elementTypes.TRUE_ONLY]: getTrueOnlyFilter,
};

const getSortOrder = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (sortOrderParts && sortOrderParts.length === 2) {
        return {
            sortById: sortOrderParts[0],
            sortByDirection: sortOrderParts[1],
        };
    }
    return null;
};

const getDataElementFilters = (elementFiltersById: ?Object, stageForm: RenderFoundation) => {
    if (elementFiltersById) {
        // $FlowFixMe
        return Object.keys(elementFiltersById).map((elementId) => {
            const element = stageForm.getElement(elementId);
            if (element) {
                const elementFilter = elementFiltersById[elementId];
                if (element.optionSet && element.optionSet.options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
                    return { dataItem: elementId, ...getMultiSelectOptionSetFilter(elementFilter, element) };
                }
                // $FlowFixMe
                return { dataItem: elementId, ...(getFilterByType[element.type] ? getFilterByType[element.type](elementFilter, element) : null) };
            }
            return null;
        }).filter(filter => filter !== null);
    }
    return [];
};

const getMainDataFilters = (statusFilter: ?string, eventDateFilter: any) => {
    const mainDataFilters = {};
    if (statusFilter) {
        mainDataFilters.status = statusFilter;
    }
    if (eventDateFilter) {
        mainDataFilters.eventDate = getDateFilter(eventDateFilter);
    }
    return mainDataFilters;
};

type WorkingListConfigData = {
    id?: ?string,
    name: string,
    description: string,
    filtersByKey: Object,
    programId: string,
}

export function convertToEventFilter(
    workingListConfigData: WorkingListConfigData,
    stageForm: RenderFoundation,
) {
    const { id, name, description, filtersByKey, programId } = workingListConfigData;
    const { eventDate, status, ...elementFilters } = filtersByKey;

    const eventQueryCriteria = {
        ...getMainDataFilters(status, eventDate),
        dataFilters: getDataElementFilters(elementFilters, stageForm),
    };

    return {
        id,
        name,
        description,
        program: programId,
        eventQueryCriteria,
    };
}
