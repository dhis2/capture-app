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
                .map(({ id, type, mainProperty, apiName }) => [id, { id, type, mainProperty, apiName }]),
        );
        onLoadView(selectedTemplate, context, { columnsMetaForDataFetching });
    }, [onLoadView, defaultColumns]);

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
        onUpdateList: useCallback(queryArgs => onUpdateList(queryArgs, 1, {}), [onUpdateList]),
    };
    // ------------------------------

    return (
        <WorkingLists
            {...passOnProps}
            {...dummyData}
            columns={columns}
            dataSource={useDataSource(records, recordsOrder, columns)}
            onLoadView={useInjectColumnMetaToLoadList(defaultColumns, onLoadView)}
            programId={program.id}
            rowIdKey="id"
        />
    );
};
