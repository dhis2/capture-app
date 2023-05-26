// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { convertValue as getApiOptionSetFilter } from './optionSet';
import { getFilterByType } from './convertors';

export const convertToEventFilterQuery = ({
    filters,
    dataElementsValueFilters,
    mainFilters,
}: {
    filters: Object,
    dataElementsValueFilters: Array<any>,
    mainFilters: Array<{ id: string, type: string }>,
}): Array<any> =>
    Object.keys(filters)
        .map((key) => {
            const filter = filters[key];
            const element = dataElementsValueFilters.find(column => column.id === key);
            const isMainFilter = mainFilters.find(mainFilter => mainFilter.id === key);

            // clean here
            if (!filter || !element || isMainFilter) {
                return null;
            }

            // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
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
                // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
                ...getFilterByType[element.type](filter),
                dataItem: key,
            };
        })
        .filter(item => item);
