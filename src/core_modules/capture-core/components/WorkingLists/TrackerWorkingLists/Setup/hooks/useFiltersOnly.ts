import { useMemo } from 'react';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes, useProgramLabel, type TrackerProgram } from '../../../../../metaData';
import { MAIN_FILTERS } from '../../constants';

export const useFiltersOnly = (
    { id, enrollment: { enrollmentDateLabel, incidentDateLabel, showIncidentDate }, stages }: TrackerProgram,
    programStageId?: string,
) => {
    const enrollmentLabel = useProgramLabel('enrollment', { programId: id }) ?? i18n.t('Enrollment');
    const followUpLabel = useProgramLabel('followUp', { programId: id }) ?? i18n.t('Follow up');
    return useMemo(() => {
        const enableUserAssignment =
            !programStageId && Array.from(stages.values()).find((stage: any) => stage.enableUserAssignment);
        return [
            {
                id: MAIN_FILTERS.PROGRAM_STATUS,
                type: dataElementTypes.TEXT,
                header: i18n.t('{{enrollment}} status', { enrollment: enrollmentLabel }),
                options: [
                    { text: i18n.t('Active'), value: 'ACTIVE' },
                    { text: i18n.t('Completed'), value: 'COMPLETED' },
                    { text: i18n.t('Cancelled'), value: 'CANCELLED' },
                ],
                transformRecordsFilter: (rawFilter: string) => ({
                    [featureAvailable(FEATURES.enrollmentStatusReplaceProgramStatusQueryParam)
                        ? 'enrollmentStatus'
                        : 'programStatus'
                    ]: rawFilter.split(':')[1],
                }),
            },
            {
                id: MAIN_FILTERS.ENROLLED_AT,
                type: dataElementTypes.DATE,
                header: enrollmentDateLabel,
                transformRecordsFilter: (filter: string) => {
                    const queryArgs: any = {};
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
            ...(showIncidentDate
                ? [
                    {
                        id: MAIN_FILTERS.OCCURED_AT,
                        type: dataElementTypes.DATE,
                        header: incidentDateLabel,
                        transformRecordsFilter: (filter: string) => {
                            const queryArgs: any = {};
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
                    },
                ]
                : []),
            {
                id: MAIN_FILTERS.FOLLOW_UP,
                type: dataElementTypes.BOOLEAN,
                header: followUpLabel,
                showInMoreFilters: true,
                multiValueFilter: false,
                transformRecordsFilter: (rawFilter: string) => ({
                    followUp: rawFilter.split(':')[1],
                }),
            },
            ...(enableUserAssignment
                ? [
                    {
                        id: MAIN_FILTERS.ASSIGNEE,
                        type: dataElementTypes.ASSIGNEE,
                        header: i18n.t('Assigned to'),
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
    }, [enrollmentDateLabel, incidentDateLabel, showIncidentDate, stages, programStageId, enrollmentLabel, followUpLabel]);
};
