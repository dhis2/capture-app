// @flow
import React, { useCallback } from 'react';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingLists } from '../../WorkingLists';
import { useDefaultColumnConfig } from './useDefaultColumnConfig';
import { useColumns, useDataSource } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs, TeiColumnsMetaForDataFetching } from '../types';

const useInjectColumnMetaToLoadList = (defaultColumns, onLoadView) =>
    useCallback((selectedTemplate: Object, context: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, mainProperty, apiName, visible }) => [id, { id, type, mainProperty, apiName, visible }]),
        );
        onLoadView(selectedTemplate, context, { columnsMetaForDataFetching });
    }, [onLoadView, defaultColumns]);

const useInjectColumnMetaToUpdateList = (defaultColumns, onUpdateList) =>
    useCallback((queryArgs: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, mainProperty }) => [id, { id, type, apiName, mainProperty }]),
        );
        onUpdateList(queryArgs, columnsMetaForDataFetching, 0);
    }, [onUpdateList, defaultColumns]);

export const TeiWorkingListsSetup = ({
    program,
    onDeleteTemplate,
    onUpdateList,
    onLoadView,
    customColumnOrder,
    records,
    recordsOrder,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);

    // ------- DUMMY DATA!!! --------
    const dummyData = {
        onDeleteTemplate: template => onDeleteTemplate(template, program.id),
    };
    // ------------------------------

    return (
        <WorkingLists
            {...passOnProps}
            {...dummyData}
            columns={columns}
            dataSource={useDataSource(records, recordsOrder, columns)}
            onLoadView={useInjectColumnMetaToLoadList(defaultColumns, onLoadView)}
            onUpdateList={useInjectColumnMetaToUpdateList(defaultColumns, onUpdateList)}
            programId={program.id}
            rowIdKey="id"
        />
    );
};
