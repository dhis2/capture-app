// @flow
import React, { useCallback, useMemo, useEffect } from 'react';
import uuid from 'uuid/v4';
import i18n from '@dhis2/d2-i18n';
import { useFeature, FEATURES } from 'capture-core-utils';
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
import { MAIN_FILTERS, ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../constants';

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

const useFiltersOnly = ({
    enrollment: { enrollmentDateLabel, incidentDateLabel, showIncidentDate },
    stages,
}: TrackerProgram) =>
    useMemo(() => {
        const enableUserAssignment = Array.from(stages.values()).find(stage => stage.enableUserAssignment);

        return [
            {
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
            },
            {
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
            },
            ...(showIncidentDate ? [{
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
            }] : []),
            ...(enableUserAssignment ? [{
                id: MAIN_FILTERS.ASSIGNEE,
                type: dataElementTypes.ASSIGNEE,
                header: i18n.t('Assigned to'),
                transformRecordsFilter: (rawFilter: Object) => rawFilter,
            }] : []),
        ];
    }, [enrollmentDateLabel, incidentDateLabel, showIncidentDate, stages]);


const useProgramStageFilters = ({ stages }: TrackerProgram, programStage?: string) => {
    const supportsProgramStageWorkingLists = useFeature(FEATURES.programStageWorkingList);

    return useMemo(() => {
        if (supportsProgramStageWorkingLists) {
            return [
                {
                    id: ADDITIONAL_FILTERS.programStage,
                    type: 'TEXT',
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.programStage),
                    options: [...stages.entries()].map(stage => ({ text: stage[1].name, value: stage[1].id })),
                    mainButton: true,
                },
                {
                    id: ADDITIONAL_FILTERS.occurredAt,
                    type: 'TEXT',
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt),
                    disabled: !programStage,
                    tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                        label: ADDITIONAL_FILTERS_LABELS.occurredAt,
                        interpolation: { escapeValue: false },
                    }),
                },
                {
                    id: ADDITIONAL_FILTERS.status,
                    type: 'TEXT',
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.status),
                    disabled: !programStage,
                    tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                        label: ADDITIONAL_FILTERS_LABELS.status,
                        interpolation: { escapeValue: false },
                    }),
                },
            ];
        }
        return [];
    }, [stages, programStage, supportsProgramStageWorkingLists]);
};

const useFiltersToKeep = (columns, filters, filtersOnly, programStageFiltersOnly) =>
    useMemo(() => {
        if (filters) {
            const filtersListToKeep = [
                ...columns,
                ...filtersOnly,
                // $FlowFixMe[prop-missing]
                ...programStageFiltersOnly.filter(filterOnly => filterOnly.mainButton),
            ].map(({ id }) => id);

            const filtersObjectToKeep = Object.entries(filters).reduce(
                (acc, [key, value]) => (filtersListToKeep.includes(key) ? { ...acc, [key]: value } : acc),
                {},
            );
            return filtersObjectToKeep;
        }
        return {};
    }, [columns, filtersOnly, programStageFiltersOnly, filters]);


const useInjectDataFetchingMetaToLoadList = (defaultColumns, filtersOnly, onLoadView) =>
    useCallback((selectedTemplate: Object, context: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, mainProperty, visible }) => [id, { id, type, mainProperty, visible }]),
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
                .map(({ id, type, mainProperty }) => [id, { id, type, mainProperty }]),
        );
        const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching = new Map(
            filtersOnly
                .map(({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }]));
        const programStageId = queryArgs.filters?.programStage?.values[0];

        onUpdateList(
            { ...queryArgs, programStageId },
            { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching },
            0,
        );
    }, [defaultColumns, filtersOnly, onUpdateList]);

export const TeiWorkingListsSetup = ({
    program,
    programStage,
    onUpdateList,
    onLoadView,
    onClearFilters,
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
    const defaultColumns = useDefaultColumnConfig(program, orgUnitId, programStage);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program);
    const programStageFiltersOnly = useProgramStageFilters(program, programStage);
    const filtersObjectToKeep = useFiltersToKeep(columns, filters, filtersOnly, programStageFiltersOnly);

    const staticTemplates = useStaticTemplates();
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;

    useEffect(() => {
        onClearFilters && onClearFilters(filtersObjectToKeep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [programStage]);

    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters,
        columns,
        sortById,
        sortByDirection,
        programStage,
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
            additionalFilters={programStageFiltersOnly}
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
