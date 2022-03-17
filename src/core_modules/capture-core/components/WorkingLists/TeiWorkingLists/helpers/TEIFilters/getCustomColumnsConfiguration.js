// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { CustomColumnOrder } from '../../../WorkingListsCommon';
import type { TeiColumnsMetaForDataFetching } from '../../types';

const buildCustomColumnsConfiguration = (
    customApiOrder: Array<string>,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
): CustomColumnOrder => {
    const columnsMetaForDataFetchingById = new Map(
        [...columnsMetaForDataFetching.entries()].map(([, config]) => [config.id, config]),
    );

    const visibleColumnsAsMap = new Map(
        customApiOrder
            .map((id: string) => {
                if (columnsMetaForDataFetching.has(id)) {
                    return id;
                }

                const element = columnsMetaForDataFetchingById.get(id);
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

    // $FlowFixMe
    return [...visibleColumnsAsMap.values(), ...hiddenColumns];
};

export const getCustomColumnsConfiguration = (
    customApiOrder?: ?Array<string>,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
): CustomColumnOrder | void => {
    if (customApiOrder && customApiOrder.length > 0) {
        return buildCustomColumnsConfiguration(customApiOrder, columnsMetaForDataFetching);
    }

    return undefined;
};
