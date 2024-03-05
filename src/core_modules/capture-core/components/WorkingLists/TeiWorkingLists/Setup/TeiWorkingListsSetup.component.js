// @flow
import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingListsBase } from '../../WorkingListsBase';
import {
    useDefaultColumnConfig,
    useStaticTemplates,
    useFiltersOnly,
    useProgramStageFilters,
    useInjectDataFetchingMetaToLoadList,
    useInjectDataFetchingMetaToUpdateList,
} from './hooks';
import { useColumns, useDataSource, useViewHasTemplateChanges } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs } from '../types';
import { buildArgumentsForTemplate } from '../helpers';

const DEFAULT_TEMPLATES_LENGTH = 1;

const shouldPreserveViewState = ({
    currentTemplateId,
    prevTemplateId,
    defaultTemplateId,
    programStageId,
    prevProgramStageId,
}) =>
    currentTemplateId !== defaultTemplateId &&
    currentTemplateId === prevTemplateId.current &&
    ((programStageId && prevProgramStageId.current === undefined) ||
        (programStageId === undefined && prevProgramStageId.current));

const useCurrentTemplate = (templates, currentTemplateId) => useMemo(() =>
    (currentTemplateId && templates.find(template => template.id === currentTemplateId)) || templates[0],
[templates, currentTemplateId]);

export const TeiWorkingListsSetup = ({
    program,
    programStageId,
    onUpdateList,
    onLoadView,
    onClearFilters,
    onResetListColumnOrder,
    onPreserveCurrentViewState,
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
    templates: storedTemplates,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    forceUpdateOnMount,
    ...passOnProps
}: Props) => {
    const prevProgramStageId = useRef(programStageId);
    const prevTemplateId = useRef(currentTemplateId);
    const defaultColumns = useDefaultColumnConfig(program, orgUnitId, programStageId);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program);
    const programStageFiltersOnly = useProgramStageFilters(program, programStageId);
    const staticTemplates = useStaticTemplates(
        storedTemplates?.find(storedTemplate => storedTemplate.isDefault && storedTemplate.isAltered),
    );
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;
    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters,
        columns,
        sortById,
        sortByDirection,
        programStageId,
        isDefaultTemplateAltered: storedTemplates?.find(template => template.isDefault)?.isAltered,
    });

    useEffect(() => {
        const viewHasProgramStageChanges = viewHasChanges && programStageId !== prevProgramStageId.current;

        if (viewHasProgramStageChanges) {
            onResetListColumnOrder && onResetListColumnOrder();
            const defaultTemplateId = `${program.id}-default`;
            if (
                shouldPreserveViewState({
                    currentTemplateId,
                    defaultTemplateId,
                    programStageId,
                    prevProgramStageId,
                    prevTemplateId,
                })
            ) {
                const { criteria } = buildArgumentsForTemplate({
                    filters,
                    filtersOnly,
                    programStageFiltersOnly,
                    columns,
                    sortById,
                    sortByDirection,
                    programId: program.id,
                    programStageId,
                });

                onPreserveCurrentViewState(defaultTemplateId, criteria);
            }
        }
        prevTemplateId.current = currentTemplateId;
        prevProgramStageId.current = programStageId;
    }, [
        programStageId,
        onResetListColumnOrder,
        viewHasChanges,
        program,
        onPreserveCurrentViewState,
        filters,
        filtersOnly,
        programStageFiltersOnly,
        columns,
        sortById,
        sortByDirection,
        currentTemplateId,
        prevTemplateId,
    ]);

    const injectArgumentsForAddTemplate = useCallback(
        (name) => {
            const { criteria, data } = buildArgumentsForTemplate({
                filters,
                filtersOnly,
                programStageFiltersOnly,
                columns,
                sortById,
                sortByDirection,
                programId: program.id,
                programStageId,
            });
            onAddTemplate(name, criteria, data);
        },
        [
            onAddTemplate,
            filters,
            filtersOnly,
            programStageFiltersOnly,
            columns,
            sortById,
            sortByDirection,
            program.id,
            programStageId,
        ],
    );

    const injectArgumentsForUpdateTemplate = useCallback(
        (template) => {
            const { criteria, data } = buildArgumentsForTemplate({
                filters,
                filtersOnly,
                programStageFiltersOnly,
                columns,
                sortById,
                sortByDirection,
                programId: program.id,
                programStageId,
            });
            onUpdateTemplate(template, criteria, data);
        },
        [
            onUpdateTemplate,
            filters,
            filtersOnly,
            programStageFiltersOnly,
            columns,
            sortById,
            sortByDirection,
            program.id,
            programStageId,
        ],
    );

    const injectArgumentsForDeleteTemplate = useCallback(
        template => onDeleteTemplate(template, program.id, programStageId),
        [onDeleteTemplate, program.id, programStageId],
    );

    return (
        <WorkingListsBase
            {...passOnProps}
            forceUpdateOnMount={forceUpdateOnMount}
            currentTemplate={useCurrentTemplate(templates, currentTemplateId)}
            templates={templates}
            columns={columns}
            onAddTemplate={injectArgumentsForAddTemplate}
            onUpdateTemplate={injectArgumentsForUpdateTemplate}
            onDeleteTemplate={injectArgumentsForDeleteTemplate}
            filtersOnly={filtersOnly}
            additionalFilters={programStageFiltersOnly}
            dataSource={useDataSource(records, recordsOrder, columns)}
            onLoadView={useInjectDataFetchingMetaToLoadList(
                defaultColumns,
                filtersOnly,
                programStageFiltersOnly,
                onLoadView,
            )}
            onUpdateList={useInjectDataFetchingMetaToUpdateList(
                defaultColumns,
                filtersOnly,
                programStageFiltersOnly,
                onUpdateList,
            )}
            programId={program.id}
            programStageId={programStageId}
            rowIdKey="id"
            orgUnitId={orgUnitId}
            currentViewHasTemplateChanges={viewHasChanges}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
        />
    );
};
