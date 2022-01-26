// @flow
import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';
import { filterTypesObject, type DateFilterData } from '../../../../WorkingListsBase';

const getDateFilter = (dateFilter): DateFilterData => ({
    le: dateFilter.periodFrom ? moment().subtract(dateFilter.periodFrom, 'days').format('YYYY-MM-DD') : undefined,
    ge: dateFilter.periodTo ? moment().subtract(dateFilter.periodTo, 'days').format('YYYY-MM-DD') : undefined,
    type: 'ABSOLUTE',
});

const getFilterByType = {
    [filterTypesObject.DATE]: getDateFilter,
};

export function convertToClientConfig(value: any, type: $Keys<typeof dataElementTypes>) {
    if (value == null) {
        return null;
    }
    // $FlowFixMe dataElementTypes flow error
    return getFilterByType[type] ? getFilterByType[type](value) : value;
}
