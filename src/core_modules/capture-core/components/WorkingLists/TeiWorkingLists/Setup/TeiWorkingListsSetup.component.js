// @flow
import React, { useCallback, useMemo } from 'react';
import uuid from 'uuid/v4';
import i18n from '@dhis2/d2-i18n';
import {
    dataElementTypes,
    type TrackerProgram,
} from '../../../../metaData';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingListsBase } from '../../WorkingListsBase';
import { useDefaultColumnConfig } from './useDefaultColumnConfig';
import { useColumns, useDataSource, useViewHasTemplateChanges } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs, TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../types';
import { convertToTEIFilterMainFilters, convertToTEIFilterAttributes } from '../helpers/TEIFilters/clientConfigToApiTEIFilterQueryConverter';
import { MAIN_FILTERS } from '../constants';

const DEFAULT_TEMPLATES_LENGTH = 1;
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
    id: MAIN_FILTERS.PROGRAM_STATUS,
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
    id: MAIN_FILTERS.ENROLLED_AT,
    type: dataElementTypes.DATE,
    header: enrollmentDateLabel,
    transformRecordsFilter: (filter: string) => {
        const queryArgs = {};
        const filterParts = filter.split(':');
        const indexGe = filterParts.indexOf('ge');
        const indexLe = filterParts.indexOf('le');
        if (indexGe !== -1 && filterParts[indexGe + 1]) {
            queryArgs.enrollmentEnrolledAfter = filterParts[indexGe + 1];
        }
        if (indexLe !== -1 && filterParts[indexLe + 1]) {
            queryArgs.enrollmentEnrolledBefore = filterParts[indexLe + 1];
        }
        return queryArgs;
    },
}, {
    id: MAIN_FILTERS.OCCURED_AT,
    type: dataElementTypes.DATE,
    header: incidentDateLabel,
    transformRecordsFilter: (filter: string) => {
        const queryArgs = {};
        const filterParts = filter.split(':');
        const indexGe = filterParts.indexOf('ge');
        const indexLe = filterParts.indexOf('le');
        if (indexGe !== -1 && filterParts[indexGe + 1]) {
            queryArgs.enrollmentOccurredAfter = filterParts[indexGe + 1];
        }
        if (indexLe !== -1 && filterParts[indexLe + 1]) {
            queryArgs.enrollmentOccurredBefore = filterParts[indexLe + 1];
        }
        return queryArgs;
    },
}, {
    id: MAIN_FILTERS.ASSIGNEE,
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
    orgUnitId,
    apiTemplates,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program, orgUnitId);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program);
    const staticTemplates = useStaticTemplates();
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;

    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters,
        columns,
        sortById,
        sortByDirection,
    });

    const injectArgumentsForAddTemplate = useCallback(
        (name) => {
            const mainFilters = convertToTEIFilterMainFilters({ filters, mainFilters: filtersOnly });
            const attributeValueFilters = convertToTEIFilterAttributes({ filters, attributeValueFilters: columns });
            const visibleColumnIds = columns && columns.filter(({ visible }) => visible).map(({ id }) => id);
            const criteria = { ...mainFilters,
                attributeValueFilters,
                order: `${sortById}:${sortByDirection}`,
                displayColumnOrder: visibleColumnIds };
            const data = {
                program: { id: program.id },
                clientId: uuid(),
                sortById,
                sortByDirection,
                filters,
                visibleColumnIds,
            };
            onAddTemplate(name, criteria, data);
        },
        [onAddTemplate, filters, filtersOnly, columns, sortById, sortByDirection, program.id],
    );

    const injectArgumentsForUpdateTemplate = useCallback(
        (template) => {
            const mainFilters = convertToTEIFilterMainFilters({ filters, mainFilters: filtersOnly });
            const attributeValueFilters = convertToTEIFilterAttributes({ filters, attributeValueFilters: columns });
            const visibleColumnIds = columns && columns.filter(({ visible }) => visible).map(({ id }) => id);
            const criteria = { ...mainFilters,
                attributeValueFilters,
                order: `${sortById}:${sortByDirection}`,
                displayColumnOrder: visibleColumnIds,
            };
            const data = {
                program: { id: program.id },
                clientId: uuid(),
                sortById,
                sortByDirection,
                filters,
                visibleColumnIds,
            };
            onUpdateTemplate(template, criteria, data);
        },
        [onUpdateTemplate, filters, filtersOnly, columns, sortById, sortByDirection, program.id],
    );

    const injectArgumentsForDeleteTemplate = useCallback(template => onDeleteTemplate(template, program.id), [onDeleteTemplate, program.id]);

    return (
        <WorkingListsBase
            {...passOnProps}
            currentTemplate={useCurrentTemplate(templates, currentTemplateId)}
            templates={templates}
            columns={columns}
            onAddTemplate={injectArgumentsForAddTemplate}
            onUpdateTemplate={injectArgumentsForUpdateTemplate}
            onDeleteTemplate={injectArgumentsForDeleteTemplate}
            filtersOnly={filtersOnly}
            dataSource={useDataSource(records, recordsOrder, columns)}
            onLoadView={useInjectDataFetchingMetaToLoadList(defaultColumns, filtersOnly, onLoadView)}
            onUpdateList={useInjectDataFetchingMetaToUpdateList(defaultColumns, filtersOnly, onUpdateList)}
            programId={program.id}
            rowIdKey="id"
            orgUnitId={orgUnitId}
            currentViewHasTemplateChanges={viewHasChanges}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
        />
    );
};
