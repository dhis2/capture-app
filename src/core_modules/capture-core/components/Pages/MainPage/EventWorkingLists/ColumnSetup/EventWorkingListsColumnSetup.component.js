// @flow
import React, { useMemo, useCallback } from 'react';
import { getDefaultColumnConfig } from './defaultColumnConfiguration';
import { shouldSkipReload } from './skipReloadCalculator';
import { CurrentViewChangesResolver } from '../CurrentViewChangesResolver';
import type { Props } from './eventWorkingListsColumnSetup.types';
import type { ColumnsMetaForDataFetching } from '../types';

export const EventWorkingListsColumnSetup = ({
    program,
    customColumnOrder,
    onLoadEventList,
    onUpdateEventList,
    ...passOnProps
}: Props) => {
    const defaultColumns = useMemo(() => getDefaultColumnConfig(program), [
        program,
    ]);

    const injectColumnMetaToLoadList = useCallback((selectedTemplate: Object, context: Object, meta: Object) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onLoadEventList(selectedTemplate, context, { ...meta, columnsMetaForDataFetching });
    }, [onLoadEventList, defaultColumns]);

    const injectColumnMetaToUpdateList = useCallback((queryArgs: Object) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onUpdateEventList(queryArgs, columnsMetaForDataFetching);
    }, [onUpdateEventList, defaultColumns]);


    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

    const columns = useMemo(() => {
        if (!customColumnOrder) {
            return defaultColumns;
        }

        return customColumnOrder
            .map(({ id, visible }) => ({
                ...defaultColumnsAsObject[id],
                visible,
            }));
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);

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
