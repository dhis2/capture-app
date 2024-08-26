// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { statusTypes, translatedStatusTypes } from 'capture-core/events/statusTypes';
import { type TrackerProgram, type ProgramStage } from '../../../../../metaData';
import { ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../../helpers';

const useProgramStageData = (programStageId, stages) =>
    useMemo(() => {
        const programStage = programStageId && stages.get(programStageId);
        if (programStage) {
            return {
                hideDueDate: programStage.hideDueDate,
                occurredAtLabel: programStage.stageForm.getLabel('occurredAt'),
                scheduledAtLabel: programStage.stageForm.getLabel('scheduledAt'),
            };
        }
        return {
            occurredAtLabel: i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt),
            scheduledAtLabel: i18n.t(ADDITIONAL_FILTERS_LABELS.scheduledAt),
            hideDueDate: undefined,
        };
    }, [programStageId, stages]);

const useProgramStageDropdowOptions = stages =>
    useMemo(
        () =>
            [...stages.values()].map((stage: ProgramStage) => ({
                text: stage.name,
                value: stage.id,
            })),
        [stages],
    );

export const useProgramStageFilters = ({ stages }: TrackerProgram, programStageId?: string) => {
    const { hideDueDate, occurredAtLabel, scheduledAtLabel } = useProgramStageData(programStageId, stages);
    const options: Array<{ text: string, value: string }> = useProgramStageDropdowOptions(stages);

    return useMemo(() => {
        const translatedStatus = translatedStatusTypes();
        return [
            {
                id: ADDITIONAL_FILTERS.programStage,
                type: 'TEXT',
                header: i18n.t(ADDITIONAL_FILTERS_LABELS.programStage),
                options,
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
            ...(hideDueDate === false
                ? [
                    {
                        id: ADDITIONAL_FILTERS.scheduledAt,
                        type: 'DATE',
                        header: scheduledAtLabel,
                        disabled: !programStageId,
                        tooltipContent: i18n.t('Choose a program stage to filter by {{label}}', {
                            label: scheduledAtLabel,
                            interpolation: { escapeValue: false },
                        }),
                        transformRecordsFilter: (filter: string) => {
                            const queryArgs = {};
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
        ];
    }, [programStageId, occurredAtLabel, scheduledAtLabel, hideDueDate, options]);
};
