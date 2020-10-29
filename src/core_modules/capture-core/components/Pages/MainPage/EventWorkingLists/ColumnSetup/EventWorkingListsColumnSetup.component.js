// @flow
import React, { useMemo, useCallback } from 'react';
import { getDefaultColumnConfig } from '../../EventWorkingListsCommon';
import { CurrentViewChangesResolver } from '../CurrentViewChangesResolver';
import type { Props } from './eventWorkingListsColumnSetup.types';
import type { ColumnsMetaForDataFetching } from '../types';

export const EventWorkingListsColumnSetup = ({
    program,
    customColumnOrder,
    onLoadView,
    onUpdateList,
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
        onLoadView(selectedTemplate, context, { ...meta, columnsMetaForDataFetching });
    }, [onLoadView, defaultColumns]);

    const injectColumnMetaToUpdateList = useCallback((queryArgs: Object, lastTransaction: number) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onUpdateList(queryArgs, lastTransaction, columnsMetaForDataFetching);
    }, [onUpdateList, defaultColumns]);


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
            onLoadView={injectColumnMetaToLoadList}
            onUpdateList={injectColumnMetaToUpdateList}
        />
    );
};
