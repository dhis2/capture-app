// @flow
import React, { useCallback, useMemo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import i18n from '@dhis2/d2-i18n';
import { useFeature, FEATURES } from 'capture-core-utils';
import { statusTypes, translatedStatusTypes } from 'capture-core/events/statusTypes';
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
import { ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../helpers';

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


const useProgramStageFilters = ({ stages }: TrackerProgram, programStageId?: string) => {
    const supportsProgramStageWorkingLists = useFeature(FEATURES.programStageWorkingList);
    const programStage = programStageId && stages.get(programStageId);
    const occurredAtLabel = programStage
        ? programStage.stageForm.getLabel('occurredAt')
        : i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt);

    return useMemo(() => {
        if (supportsProgramStageWorkingLists) {
            const translatedStatus = translatedStatusTypes();
            return [
                {
                    id: ADDITIONAL_FILTERS.programStage,
                    type: 'TEXT',
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.programStage),
                    options: [...stages.entries()].map(stage => ({ text: stage[1].name, value: stage[1].id })),
                    mainButton: true,
                    transformRecordsFilter: () => null,
                },
                {
                    id: ADDITIONAL_FILTERS.occurredAt,
                    type: 'DATE',
                    header: occurredAtLabel,
                    disabled: !programStageId,
                    tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                        label: occurredAtLabel,
                        interpolation: { escapeValue: false },
                    }),
                    transformRecordsFilter: (filter: string) => {
                        const queryArgs = {};
                        const filterParts = filter.split(':');
                        const indexGe = filterParts.indexOf('ge');
                        const indexLe = filterParts.indexOf('le');
                        if (indexGe !== -1 && filterParts[indexGe + 1]) {
                            queryArgs.occurredAfter = filterParts[indexGe + 1];
                        }
                        if (indexLe !== -1 && filterParts[indexLe + 1]) {
                            queryArgs.occurredBefore = filterParts[indexLe + 1];
                        }
                        return queryArgs;
                    },
                },
                {
                    id: ADDITIONAL_FILTERS.status,
                    type: 'TEXT',
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.status),
                    options: [
                        { text: translatedStatus.ACTIVE, value: statusTypes.ACTIVE },
                        { text: translatedStatus.SCHEDULE, value: statusTypes.SCHEDULE },
                        { text: translatedStatus.COMPLETED, value: statusTypes.COMPLETED },
                        { text: translatedStatus.OVERDUE, value: statusTypes.OVERDUE },
                        { text: translatedStatus.SKIPPED, value: statusTypes.SKIPPED },
                    ],
                    disabled: !programStageId,
                    tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                        label: ADDITIONAL_FILTERS_LABELS.status,
                        interpolation: { escapeValue: false },
                    }),
                    transformRecordsFilter: (rawFilter: string) => ({
                        status: rawFilter.split(':')[1],
                    }),
                },
            ];
        }
        return [];
    }, [stages, programStageId, supportsProgramStageWorkingLists, occurredAtLabel]);
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

const useInjectDataFetchingMetaToUpdateList = (defaultColumns, filtersOnly, programStageFiltersOnly, onUpdateList) =>
    useCallback((queryArgs: Object) => {
        const columnsMetaForDataFetching: TeiColumnsMetaForDataFetching = new Map(
            defaultColumns
                // $FlowFixMe
                .map(({ id, type, mainProperty, additionalColumn }) => [id, { id, type, mainProperty, additionalColumn }]),
        );
        const transformFiltersOnly = filtersOnly
            .map(({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }]);

        const transformProgramStageFiltersOnly = programStageFiltersOnly
            // $FlowFixMe[prop-missing]
            .map(({ id, type, transformRecordsFilter }) => [id, { id, type, transformRecordsFilter }]);

        const filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching =
            new Map(transformFiltersOnly.concat(transformProgramStageFiltersOnly));

        onUpdateList(queryArgs, { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching }, 0);
    }, [defaultColumns, filtersOnly, programStageFiltersOnly, onUpdateList]);

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
    const filtersObjectToKeep =
        JSON.stringify(useFiltersToKeep(columns, filters, filtersOnly, programStageFiltersOnly));

    const staticTemplates = useStaticTemplates();
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;

    useEffect(() => {
        onClearFilters && onClearFilters(JSON.parse(filtersObjectToKeep));
    }, [onClearFilters, filtersObjectToKeep]);

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
            onUpdateList={useInjectDataFetchingMetaToUpdateList(defaultColumns, filtersOnly, programStageFiltersOnly, onUpdateList)}
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
