// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes, type TrackerProgram } from '../../../../../metaData';
import { MAIN_FILTERS } from '../../constants';

export const useFiltersOnly = ({
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
            ...(showIncidentDate
                ? [
                    {
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
                    },
                ]
                : []),
            {
                id: MAIN_FILTERS.FOLLOW_UP,
                type: dataElementTypes.BOOLEAN,
                header: i18n.t('Follow up'),
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
                        transformRecordsFilter: (rawFilter: Object) => rawFilter,
                    },
                ]
                : []),
        ];
    }, [enrollmentDateLabel, incidentDateLabel, showIncidentDate, stages]);
