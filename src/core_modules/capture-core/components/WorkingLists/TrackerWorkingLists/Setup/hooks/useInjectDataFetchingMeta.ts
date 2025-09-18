import { useCallback } from 'react';
import type {
    TeiColumnsMetaForDataFetching,
    TeiFiltersOnlyMetaForDataFetching,
    TrackerWorkingListsColumnConfigs,
    TrackerWorkingListsColumnConfig,
    LoadTeiView,
} from '../../types';
import type { UpdateList } from '../../../WorkingListsCommon';
import type { FiltersOnly } from '../../../../ListView';

export const useInjectDataFetchingMetaToLoadList = (
    defaultColumns: TrackerWorkingListsColumnConfigs,
    filtersOnly: FiltersOnly,
    programStageFiltersOnly: FiltersOnly,
    onLoadView: LoadTeiView,
) =>
    useCallback(
        (selectedTemplate: any, context: any) => {
            const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
                defaultColumns.map((defaultColumn: TrackerWorkingListsColumnConfig) => {
                    const { id, type, visible, apiViewName, unique } = defaultColumn;
                    const mainProperty = 'mainProperty' in defaultColumn && defaultColumn.mainProperty && typeof (defaultColumn as any).mainProperty === 'boolean'
                        ? defaultColumn.mainProperty
                        : undefined;
                    const additionalColumn = defaultColumn.additionalColumn
                        ? defaultColumn.additionalColumn
                        : undefined;

                    return [
                        id,
                        {
                            id,
                            type,
                            visible,
                            mainProperty,
                            additionalColumn,
                            apiViewName,
                            unique,
                        },
                    ];
                }),
            );
            const transformFiltersOnly = filtersOnly.map(({ id, type, transformRecordsFilter }) => [
                id,
                { id, type, transformRecordsFilter },
            ]);

            const transformProgramStageFiltersOnly = programStageFiltersOnly.map(
                ({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }],
            );

            const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching = new Map(
                transformFiltersOnly.concat(transformProgramStageFiltersOnly) as any,
            );

            onLoadView(selectedTemplate, context, { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching });
        },
        [defaultColumns, filtersOnly, programStageFiltersOnly, onLoadView],
    );

export const useInjectDataFetchingMetaToUpdateList = (
    defaultColumns: TrackerWorkingListsColumnConfigs,
    filtersOnly: FiltersOnly,
    programStageFiltersOnly: FiltersOnly,
    onUpdateList: UpdateList,
) =>
    useCallback(
        (queryArgs: any) => {
            const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
                defaultColumns.map((defaultColumn: TrackerWorkingListsColumnConfig) => {
                    const { id, type, visible, unique } = defaultColumn;
                    const mainProperty = 'mainProperty' in defaultColumn && 
                        defaultColumn.mainProperty && 
                        typeof defaultColumn.mainProperty === 'boolean'
                        ? defaultColumn.mainProperty
                        : undefined;
                    const additionalColumn = defaultColumn.additionalColumn
                        ? defaultColumn.additionalColumn
                        : undefined;

                    return [
                        id,
                        {
                            id,
                            type,
                            visible,
                            mainProperty,
                            additionalColumn,
                            unique,
                        },
                    ];
                }),
            );
            const transformFiltersOnly = filtersOnly.map(({ id, type, transformRecordsFilter }) => [
                id,
                { id, type, transformRecordsFilter },
            ]);

            const transformProgramStageFiltersOnly = programStageFiltersOnly.map(
                ({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }],
            );

            const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching = new Map(
                transformFiltersOnly.concat(transformProgramStageFiltersOnly) as any,
            );

            onUpdateList(queryArgs, { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching }, 0);
        },
        [defaultColumns, filtersOnly, programStageFiltersOnly, onUpdateList],
    );
