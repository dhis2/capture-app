// @flow
import React, { useCallback, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    dataElementTypes,
    type TrackerProgram,
} from '../../../../../metaData';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingLists } from '../../WorkingLists';
import { useDefaultColumnConfig } from './useDefaultColumnConfig';
import { useColumns, useDataSource, useViewHasTemplateChanges } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs, TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../types';

const useCurrentTemplate = (templates, currentTemplateId) => useMemo(() =>
    (currentTemplateId && templates.find(template => template.id === currentTemplateId)) || templates[0],
[templates, currentTemplateId]);

const useStaticTemplates = () => useMemo(() => ([{
    id: 'default',
    isDefault: true,
    name: 'default',
    access: {
        update: false,
        delete: false,
        write: false,
        manage: false,
    },
}, {
    id: 'active',
    name: 'Active enrollments',
    order: 1,
    access: {
        update: false,
        delete: false,
        write: false,
        manage: false,
    },
    criteria: {
        programStatus: 'ACTIVE',
    },
}, {
    id: 'complete',
    name: 'Completed enrollments',
    order: 2,
    access: {
        update: false,
        delete: false,
        write: false,
        manage: false,
    },
    criteria: {
        programStatus: 'COMPLETED',
    },
}, {
    id: 'cancelled',
    name: 'Cancelled enrollments',
    order: 3,
    access: {
        update: false,
        delete: false,
        write: false,
        manage: false,
    },
    criteria: {
        programStatus: 'CANCELLED',
    },
}]), []);

const useFiltersOnly = ({ enrollment: { enrollmentDateLabel, incidentDateLabel } }: TrackerProgram) => useMemo(() => [{
    id: 'programStatus',
    type: dataElementTypes.TEXT,
    header: i18n.t('Enrollment status'),
    options: [
        { text: i18n.t('Active'), value: 'ACTIVE' },
        { text: i18n.t('Completed'), value: 'COMPLETED' },
        { text: i18n.t('Cancelled'), value: 'CANCELLED' },
    ],
    transformRecordsFilter: (rawFilter: string) => ({
        programStatus: rawFilter.split(':')[1],
    }),
}, {
    id: 'enrollmentDate',
    type: dataElementTypes.DATE,
    header: enrollmentDateLabel,
    transformRecordsFilter: (filter: Array<string> | string) => {
        let queryArgs = {};
        if (Array.isArray(filter)) {
            queryArgs = filter
                .reduce((acc, filterPart: string) => {
                    if (filterPart.startsWith('ge')) {
                        acc.programStartDate = filterPart.replace('ge:', '');
                    } else {
                        acc.programEndDate = filterPart.replace('le:', '');
                    }
                    return acc;
                }, {});
        } else if (filter.startsWith('ge')) {
            queryArgs.programStartDate = filter.replace('ge:', '');
        } else {
            queryArgs.programEndDate = filter.replace('le:', '');
        }
        return queryArgs;
    },
}, {
    id: 'incidentDate',
    type: dataElementTypes.DATE,
    header: incidentDateLabel,
    transformRecordsFilter: (filter: Array<string> | string) => {
        let queryArgs = {};
        if (Array.isArray(filter)) {
            queryArgs = filter
                .reduce((acc, filterPart: string) => {
                    if (filterPart.startsWith('ge')) {
                        acc.programIncidentStartDate = filterPart.replace('ge:', '');
                    } else {
                        acc.programIncidentEndDate = filterPart.replace('le:', '');
                    }
                    return acc;
                }, {});
        } else if (filter.startsWith('ge')) {
            queryArgs.programIncidentStartDate = filter.replace('ge:', '');
        } else {
            queryArgs.programIncidentEndDate = filter.replace('le:', '');
        }
        return queryArgs;
    },
}, {
    id: 'assignee',
    type: dataElementTypes.ASSIGNEE,
    header: i18n.t('Assigned to'),
    transformRecordsFilter: (rawFilter: Object) => rawFilter,
}], [enrollmentDateLabel, incidentDateLabel]);

const useInjectDataFetchingMetaToLoadList = (defaultColumns, filtersOnly, onLoadView) =>
    useCallback((selectedTemplate: Object, context: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, mainProperty, apiName, visible }) => [id, { id, type, mainProperty, apiName, visible }]),
        );
        const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching = new Map(
            filtersOnly
                .map(({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }]));

        onLoadView(selectedTemplate, context, { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching });
    }, [defaultColumns, filtersOnly, onLoadView]);

const useInjectDataFetchingMetaToUpdateList = (defaultColumns, filtersOnly, onUpdateList) =>
    useCallback((queryArgs: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, apiName, mainProperty }) => [id, { id, type, apiName, mainProperty }]),
        );
        const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching = new Map(
            filtersOnly
                .map(({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }]));

        onUpdateList(queryArgs, { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching }, 0);
    }, [defaultColumns, filtersOnly, onUpdateList]);

export const TeiWorkingListsSetup = ({
    program,
    onUpdateList,
    onLoadView,
    customColumnOrder,
    records,
    recordsOrder,
    currentTemplateId,
    initialViewConfig,
    filters,
    sortById,
    sortByDirection,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program);
    const templates = useStaticTemplates();
    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters,
        columns,
        sortById,
        sortByDirection,
    });

    return (
        <WorkingLists
            {...passOnProps}
            currentTemplate={useCurrentTemplate(templates, currentTemplateId)}
            templates={templates}
            columns={columns}
            filtersOnly={filtersOnly}
            dataSource={useDataSource(records, recordsOrder, columns)}
            onLoadView={useInjectDataFetchingMetaToLoadList(defaultColumns, filtersOnly, onLoadView)}
            onUpdateList={useInjectDataFetchingMetaToUpdateList(defaultColumns, filtersOnly, onUpdateList)}
            programId={program.id}
            rowIdKey="id"
            currentViewHasTemplateChanges={viewHasChanges}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
        />
    );
};
