// @flow
import type {
    TeiColumnMetaForDataFetching,
    TeiColumnsMetaForDataFetching,
} from '../../../../types';
import { getFilterApiName } from '../../../../helpers';

export const getColumnsQueryArgs = (
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching | Map<string, {
        ...TeiColumnMetaForDataFetching,
        additionalColumn?: boolean,
    }>,
) => {
    const columnsMetaForDataFetchingArray = [...columnsMetaForDataFetching.values()];
    return columnsMetaForDataFetchingArray.reduce((acc, item) => {
        const column = { ...item, id: getFilterApiName(item.id) };
        acc = [...acc, column];
        return acc;
    }, []);
};
