// @flow
import React, { useCallback } from 'react';
import { useColumns } from '../../WorkingListsCommon';
import { useDefaultColumnConfig, type EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import { CurrentViewChangesResolver } from '../CurrentViewChangesResolver';
import type { Props } from './eventWorkingListsColumnSetup.types';
import type { ColumnsMetaForDataFetching } from '../types';

const useInjectColumnMetaToLoadList = (defaultColumns, onLoadView, orgUnitId) =>
    useCallback((selectedTemplate: Object, context: Object, meta: Object) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onLoadView(selectedTemplate, { ...context, orgUnitId }, { ...meta, columnsMetaForDataFetching });
    }, [onLoadView, defaultColumns, orgUnitId]);

const useInjectColumnMetaToUpdateList = (defaultColumns, onUpdateList) =>
    useCallback((queryArgs: Object, lastTransaction: number) => {
        const columnsMetaForDataFetching: ColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, isMainProperty }) => [id, { id, type, apiName, isMainProperty }]),
        );
        onUpdateList(queryArgs, { columnsMetaForDataFetching, lastTransaction });
    }, [onUpdateList, defaultColumns]);

export const EventWorkingListsColumnSetup = ({
    program,
    programStageId,
    orgUnitId,
    customColumnOrder,
    onLoadView,
    onUpdateList,
    ...passOnProps
}: Props) => {
    const programStage = program.stages.get(programStageId);

    // $FlowFixMe
    const defaultColumns = useDefaultColumnConfig(programStage);
    const injectColumnMetaToLoadList = useInjectColumnMetaToLoadList(defaultColumns, onLoadView, orgUnitId);
    const injectColumnMetaToUpdateList = useInjectColumnMetaToUpdateList(defaultColumns, onUpdateList);
    const columns = useColumns<EventWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);

    return (
        <CurrentViewChangesResolver
            {...passOnProps}
            program={program}
            programStageId={programStageId}
            orgUnitId={orgUnitId}
            columns={columns}
            defaultColumns={defaultColumns}
            onLoadView={injectColumnMetaToLoadList}
            onUpdateList={injectColumnMetaToUpdateList}
        />
    );
};
