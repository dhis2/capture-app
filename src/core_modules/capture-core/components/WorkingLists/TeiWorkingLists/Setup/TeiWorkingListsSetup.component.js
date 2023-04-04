// @flow
import React, { useCallback, useMemo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingListsBase } from '../../WorkingListsBase';
import {
    useDefaultColumnConfig,
    useStaticTemplates,
    useFiltersOnly,
    useFiltersToKeep,
    useProgramStageFilters,
    useInjectDataFetchingMetaToLoadList,
    useInjectDataFetchingMetaToUpdateList,
} from './hooks';
import { useColumns, useDataSource, useViewHasTemplateChanges } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs } from '../types';
import {
    convertToTEIFilterMainFilters,
    convertToTEIFilterAttributes,
} from '../helpers/TEIFilters/clientConfigToApiTEIFilterQueryConverter';

const DEFAULT_TEMPLATES_LENGTH = 1;
const useCurrentTemplate = (templates, currentTemplateId) => useMemo(() =>
    (currentTemplateId && templates.find(template => template.id === currentTemplateId)) || templates[0],
[templates, currentTemplateId]);

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
