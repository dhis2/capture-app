import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { convertValue as getApiOptionSetFilter } from './optionSet';
import { getFilterByType } from './convertors';

export const convertToEventFilterQuery = ({
    filters,
    dataElementsValueFilters,
    mainFilters,
}: {
    filters: any;
    dataElementsValueFilters: any[];
    mainFilters: Array<{ id: string; type: string }>;
}): any[] =>
    Object.keys(filters)
        .map((key) => {
            const filter = filters[key];
            const element = dataElementsValueFilters.find(column => column.id === key);
            const isMainFilter = mainFilters.find(mainFilter => mainFilter.id === key);

            // clean here
            if (!filter || !element || isMainFilter) {
                return null;
            }

            if (!getFilterByType[element.type]) {
                log.error(
                    errorCreator(
                        'tried to convert a filter to api value, but there was no filter converter or specification found',
                    )({
                        filter,
                        element,
                        key,
                    }),
                );
                return null;
            }

            if (filter.usingOptionSet) {
                return {
                    ...getApiOptionSetFilter(filter, element.type),
                    dataItem: key,
                };
            }

            return {
                ...(getFilterByType[element.type](filter) as any),
                dataItem: key,
            };
        })
        .filter(item => item);
