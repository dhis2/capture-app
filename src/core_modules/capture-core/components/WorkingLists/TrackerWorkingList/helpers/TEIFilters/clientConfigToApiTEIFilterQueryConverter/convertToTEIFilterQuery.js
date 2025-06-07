// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { convertValue as getApiOptionSetFilter } from './optionSet';
import { getFilterByType } from './convertors';

export const convertToTEIFilterAttributes = ({
    filters,
    attributeValueFilters,
}: {
    filters: Object,
    attributeValueFilters: Array<any>,
}): Array<any> =>
    Object.keys(filters)
        .map((key) => {
            const filter = filters[key];
            const element = attributeValueFilters.find(column => column.id === key);

            // clean here
            if (!filter || !element) {
                return null;
            }

            // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
            if (!getFilterByType[element.type]) {
                log.error(
                    errorCreator('tried to convert a filter to api value, but there was no filter converter or specification found')({
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
                    attribute: key,
                };
            }

            return {
                // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
                ...getFilterByType[element.type](filter),
                attribute: key,
            };
        })
        .filter(item => item);
