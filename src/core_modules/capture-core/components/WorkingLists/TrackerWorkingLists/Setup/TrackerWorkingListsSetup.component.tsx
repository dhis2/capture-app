import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Props } from './trackerWorkingListsSetup.types';
import { WorkingListsBase } from '../../WorkingListsBase';
import {
    useDefaultColumnConfig,
    useFiltersOnly,
    useInjectDataFetchingMetaToLoadList,
    useInjectDataFetchingMetaToUpdateList,
    useProgramStageFilters,
    useStaticTemplates,
} from './hooks';
import { useColumns, useDataSource, useViewHasTemplateChanges } from '../../WorkingListsCommon';
import type { TrackerWorkingListsColumnConfigs } from '../types';
import { buildArgumentsForTemplate } from '../helpers';

const DEFAULT_TEMPLATES_LENGTH = 1;

const shouldPreserveViewState = ({
    currentTemplateId,
    prevTemplateId,
    defaultTemplateId,
    programStageId,
    prevProgramStageId,
}: {
    currentTemplateId?: string;
    prevTemplateId: React.MutableRefObject<string | undefined>;
    defaultTemplateId: string;
    programStageId?: string;
    prevProgramStageId: React.MutableRefObject<string | undefined>;
}) =>
    currentTemplateId !== defaultTemplateId &&
    currentTemplateId === prevTemplateId.current &&
    ((programStageId && prevProgramStageId.current === undefined) ||
        (programStageId === undefined && prevProgramStageId.current));

const useCurrentTemplate = (templates: any[], currentTemplateId?: string) => useMemo(() =>
    (currentTemplateId && templates.find(template => template.id === currentTemplateId)) || templates[0],
[templates, currentTemplateId]);

export const TrackerWorkingListsSetup = ({
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
    customUpdateTrigger,
    bulkActionBarComponent,
    ...passOnProps
}: Props) => {
    const prevProgramStageId = useRef(programStageId);
    const prevTemplateId = useRef(currentTemplateId);
    const defaultColumns = useDefaultColumnConfig(program, orgUnitId, programStageId);
    const columns = useColumns<TrackerWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const filtersOnly = useFiltersOnly(program, programStageId);
    const programStageFiltersOnly = useProgramStageFilters(program, programStageId);
    const staticTemplates = useStaticTemplates(
        storedTemplates?.find(storedTemplate => storedTemplate.isDefault && storedTemplate.isAltered),
        `${program.id}-default`,
    );
    const templates = apiTemplates?.length > DEFAULT_TEMPLATES_LENGTH ? apiTemplates : staticTemplates;
    const viewHasChanges = useViewHasTemplateChanges({
        initialViewConfig,
        defaultColumns,
        filters: filters || {},
        columns,
        sortById,
        sortByDirection,
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
        (name: string) => {
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
        (template: any) => {
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
        (template: any) => onDeleteTemplate(template, program.id, programStageId),
        [onDeleteTemplate, program.id, programStageId],
    );

    return (
        <WorkingListsBase
            {...passOnProps}
            forceUpdateOnMount={forceUpdateOnMount}
            currentTemplate={useCurrentTemplate(templates, currentTemplateId)}
            customUpdateTrigger={customUpdateTrigger}
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
            bulkActionBarComponent={bulkActionBarComponent}
        />
    );
};
