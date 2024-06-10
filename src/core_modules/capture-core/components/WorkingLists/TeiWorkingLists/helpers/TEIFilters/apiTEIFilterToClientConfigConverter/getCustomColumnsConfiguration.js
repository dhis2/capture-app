// @flow
import type { CustomColumnOrder } from '../../../../WorkingListsCommon';
import type { TeiColumnsMetaForDataFetching } from '../../../types';

const buildCustomColumnsConfiguration = (
    customApiOrder: Array<string>,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
): CustomColumnOrder => {
    const visibleColumnsAsMap = new Map(
        customApiOrder
            .map((id: string) => columnsMetaForDataFetching.has(id) && id)
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
