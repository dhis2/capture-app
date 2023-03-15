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

const shouldPreserveViewState = ({ currentTemplateId, defaultTemplateId, programStage, prevProgramStageId }) =>
    currentTemplateId !== defaultTemplateId &&
    ((programStage && prevProgramStageId.current === undefined) ||
        (programStage === undefined && prevProgramStageId.current));

const useCurrentTemplate = (templates, currentTemplateId) => useMemo(() =>
    (currentTemplateId && templates.find(template => template.id === currentTemplateId)) || templates[0],
[templates, currentTemplateId]);

export const TeiWorkingListsSetup = ({
    program,
    programStage,
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
    ...passOnProps
}: Props) => {
    const prevProgramStageId = useRef(programStage);
    const defaultColumns = useDefaultColumnConfig(program, orgUnitId, programStage);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program);
    const programStageFiltersOnly = useProgramStageFilters(program, programStage);
    const staticTemplates = useStaticTemplates(
        apiTemplates?.find(apiTemplate => apiTemplate.isDefault && apiTemplate.isAltered),
    );
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;
    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters,
        columns,
        sortById,
        sortByDirection,
        programStage,
        isDefaultTemplateAltered: storedTemplates?.find(template => template.isDefault)?.isAltered,
    });

    useEffect(() => {
        const viewHasProgramStageChanges = viewHasChanges && programStage !== prevProgramStageId.current;

        if (viewHasProgramStageChanges) {
            onResetListColumnOrder && onResetListColumnOrder();
            const defaultTemplateId = `${program.id}-default`;
            if (
                shouldPreserveViewState({
                    currentTemplateId,
                    defaultTemplateId,
                    programStage,
                    prevProgramStageId,
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
                    programStage,
                });

                onPreserveCurrentViewState(defaultTemplateId, criteria);
            }
        }
        prevProgramStageId.current = programStage;
    }, [
        programStage,
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
                programStage,
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
            programStage,
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
                programStage,
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
            programStage,
        ],
    );

    const injectArgumentsForDeleteTemplate = useCallback(
        template => onDeleteTemplate(template, program.id, programStage),
        [onDeleteTemplate, program.id, programStage],
    );

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
            programStageId={programStage}
            rowIdKey="id"
            orgUnitId={orgUnitId}
            currentViewHasTemplateChanges={viewHasChanges}
            filters={filters}
            sortById={sortById}
            sortByDirection={sortByDirection}
        />
    );
};
