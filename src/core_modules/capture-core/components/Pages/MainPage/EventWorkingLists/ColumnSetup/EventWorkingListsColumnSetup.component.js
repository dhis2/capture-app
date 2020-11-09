// @flow
import React, { useMemo, useCallback } from 'react';
import { useDefaultColumnConfig } from './defaultColumnConfiguration';
import { shouldSkipReload } from './skipReloadCalculator';
import { CurrentViewChangesResolver } from '../CurrentViewChangesResolver';
import type { Props } from './eventWorkingListsColumnSetup.types';
import type { ColumnsMetaForDataFetching } from '../types';

const useInjectColumnMetaToLoadList = (defaultColumns, onLoadEventList) =>
    useCallback((selectedTemplate: Object, context: Object, meta: Object) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onLoadEventList(selectedTemplate, context, { ...meta, columnsMetaForDataFetching });
    }, [onLoadEventList, defaultColumns]);

const useInjectColumnMetaToUpdateList = (defaultColumns, onUpdateEventList) =>
    useCallback((queryArgs: Object) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onUpdateEventList(queryArgs, columnsMetaForDataFetching);
    }, [onUpdateEventList, defaultColumns]);

const useColumns = (customColumnOrder, defaultColumns) => {
    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

    return useMemo(() => {
        if (!customColumnOrder) {
            return defaultColumns;
        }

        return customColumnOrder
            .map(({ id, visible }) => ({
                ...defaultColumnsAsObject[id],
                visible,
            }));
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);
};

export const EventWorkingListsColumnSetup = ({
    program,
    customColumnOrder,
    onLoadEventList,
    onUpdateEventList,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program);

    const injectColumnMetaToLoadList = useInjectColumnMetaToLoadList(defaultColumns, onLoadEventList);
    const injectColumnMetaToUpdateList = useInjectColumnMetaToUpdateList(defaultColumns, onUpdateEventList);

    const columns = useColumns(customColumnOrder, defaultColumns);

    return (
        <CurrentViewChangesResolver
            {...passOnProps}
            program={program}
            columns={columns}
            defaultColumns={defaultColumns}
            onCheckSkipReload={shouldSkipReload}
            onLoadEventList={injectColumnMetaToLoadList}
            onUpdateEventList={injectColumnMetaToUpdateList}
        />
    );
};
