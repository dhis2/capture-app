import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { convertValue as getApiOptionSetFilter } from './optionSet';
import { getFilterByType } from './convertors';
import { toApiEmptyValueFilter } from '../../../../../FiltersForTypes/EmptyValue';

export const convertToTEIFilterAttributes = ({
    filters,
    attributeValueFilters,
}: {
    filters: any;
    attributeValueFilters: any[];
}): any[] =>
    Object.keys(filters)
        .map((key) => {
            const filter = filters[key];
            const element = attributeValueFilters.find(column => column.id === key);

            // clean here
            if (!filter || !element) {
                return null;
            }

            if (!getFilterByType[element.type]) {
                log.error(
                    errorCreator('tried to convert a filter to api value, ' +
                        'but there was no filter converter or specification found')({
                        filter,
                        element,
                        key,
                    }),
                );
                return null;
            }

            if (typeof filter.isEmpty === 'boolean') {
                return { ...toApiEmptyValueFilter(filter), attribute: key };
            }

            if (filter.usingOptionSet) {
                return {
                    ...getApiOptionSetFilter(filter, element.type),
                    attribute: key,
                };
            }

            return {
                ...(getFilterByType[element.type](filter, element) as any),
                attribute: key,
            };
        })
        .filter(item => item);
