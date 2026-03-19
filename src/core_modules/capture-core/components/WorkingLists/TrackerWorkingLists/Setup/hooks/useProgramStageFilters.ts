import { useMemo } from 'react';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { statusTypes, translatedStatusTypes } from 'capture-core/events/statusTypes';
import { type TrackerProgram, type ProgramStage, dataElementTypes, getProgramEventAccess } from '../../../../../metaData';
import { ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../../helpers';

const useProgramStageData = (programStageId, stages) =>
    useMemo(() => {
        const programStage = programStageId && stages.get(programStageId);
        if (programStage) {
            return {
                hideDueDate: programStage.hideDueDate,
                occurredAtLabel: programStage.stageForm.getLabel('occurredAt'),
                scheduledAtLabel: programStage.stageForm.getLabel('scheduledAt'),
                enableUserAssignment: programStage.enableUserAssignment,
            };
        }
        return {
            occurredAtLabel: i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt),
            scheduledAtLabel: i18n.t(ADDITIONAL_FILTERS_LABELS.scheduledAt),
            hideDueDate: undefined,
            enableUserAssignment: false,
        };
    }, [programStageId, stages]);

const useProgramStageDropdowOptions = (stages, programId: string) =>
    useMemo(
        () =>
            [...stages.values()]
                .filter((stage: ProgramStage) => {
                    const access = getProgramEventAccess(programId, stage.id);
                    return access?.read === true;
                })
                .map((stage: ProgramStage) => ({
                    text: stage.name,
                    value: stage.id,
                })),
        [stages, programId],
    );

export const useProgramStageFilters = (program: TrackerProgram, programStageId?: string) => {
    const { hideDueDate, occurredAtLabel, scheduledAtLabel, enableUserAssignment } = useProgramStageData(
        programStageId,
        program.stages,
    );
    const options: Array<{ text: string, value: string }> = useProgramStageDropdowOptions(program.stages, program.id);

    return useMemo(() => {
        const translatedStatus = translatedStatusTypes();
        return [
            {
                id: ADDITIONAL_FILTERS.programStage,
                type: dataElementTypes.TEXT,
                header: i18n.t(ADDITIONAL_FILTERS_LABELS.programStage),
                options,
                mainButton: true,
                transformRecordsFilter: () => null,
            },
            {
                id: ADDITIONAL_FILTERS.occurredAt,
                type: dataElementTypes.DATE,
                header: occurredAtLabel,
                disabled: !programStageId,
                tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                    label: occurredAtLabel,
                    interpolation: { escapeValue: false },
                }),
                transformRecordsFilter: (filter: string) => {
                    const queryArgs: any = {};
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
                type: dataElementTypes.TEXT,
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
            ...(hideDueDate === false
                ? [
                    {
                        id: ADDITIONAL_FILTERS.scheduledAt,
                        type: dataElementTypes.DATE,
                        header: scheduledAtLabel,
                        disabled: !programStageId,
                        tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                            label: scheduledAtLabel,
                            interpolation: { escapeValue: false },
                        }),
                        transformRecordsFilter: (filter: string) => {
                            const queryArgs: any = {};
                            const filterParts = filter.split(':');
                            const indexGe = filterParts.indexOf('ge');
                            const indexLe = filterParts.indexOf('le');
                            if (indexGe !== -1 && filterParts[indexGe + 1]) {
                                queryArgs.scheduledAfter = filterParts[indexGe + 1];
                            }
                            if (indexLe !== -1 && filterParts[indexLe + 1]) {
                                queryArgs.scheduledBefore = filterParts[indexLe + 1];
                            }
                            return queryArgs;
                        },
                    },
                ]
                : []),
            ...(enableUserAssignment
                ? [
                    {
                        id: ADDITIONAL_FILTERS.assignedUser,
                        type: dataElementTypes.ASSIGNEE,
                        header: ADDITIONAL_FILTERS_LABELS.assignee,
                        transformRecordsFilter: (rawFilter: any) => {
                            const { assignedUserMode } = rawFilter;
                            const assignedUsersQueryParam: string = featureAvailable(FEATURES.newEntityFilterQueryParam)
                                ? 'assignedUsers'
                                : 'assignedUser';
                            const assignedUser = rawFilter[assignedUsersQueryParam];
                            return {
                                assignedUserMode,
                                ...(assignedUser && { [assignedUsersQueryParam]: assignedUser }),
                            };
                        },
                    },
                ]
                : []),
        ];
    }, [programStageId, occurredAtLabel, scheduledAtLabel, hideDueDate, options, enableUserAssignment]);
};
