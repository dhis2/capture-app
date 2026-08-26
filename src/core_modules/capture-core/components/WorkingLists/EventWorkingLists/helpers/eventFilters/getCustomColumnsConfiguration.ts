import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { CustomColumnOrder } from '../../../WorkingListsCommon';
import type { ColumnsMetaForDataFetching } from '../../types';

const buildCustomColumnsConfiguration = (
    customApiOrder: Array<string>,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
): CustomColumnOrder => {
    const columnsMetaForDataFetchingByApiName = new Map(
        [...columnsMetaForDataFetching.entries()]
            .map(([, config]) => [config.apiName, config]),
    );

    const visibleColumnsAsMap = new Map(customApiOrder
        .map((id) => {
            if (columnsMetaForDataFetching.has(id)) {
                return id;
            }

            const element = columnsMetaForDataFetchingByApiName.get(id);
            if (!element) {
                log.error(errorCreator('id specified in column order not valid')({ id }));
                return null;
            }

            return element.id;
        })
        .filter(id => id)
        .map(id => [id, { id, visible: true }]),
    );

    const hiddenColumns = [...columnsMetaForDataFetching.values()]
        .filter(({ id }) => !visibleColumnsAsMap.has(id))
        .map(({ id }) => ({ id, visible: false }));

    return [
        ...visibleColumnsAsMap.values(),
        ...hiddenColumns,
    ] as any;
};

export const getCustomColumnsConfiguration = (
    customApiOrder: Array<string> | null | undefined,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
): CustomColumnOrder | void => {
    if (customApiOrder && customApiOrder.length > 0) {
        return buildCustomColumnsConfiguration(customApiOrder, columnsMetaForDataFetching);
    }

    return undefined;
};
