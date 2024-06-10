// @flow
import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { eventStatuses, plainStatus } from '../../../constants/status.const';
import { CompleteModalComponent } from './CompleteModal.component';
import type { Props } from './completeModal.types';

export const CompleteModal = ({ enrollment, events, programStages, setOpenCompleteModal, onUpdateStatus }: Props) => {
    const { fromClientDate } = useTimeZoneConversion();
    const { programStagesWithActiveEvents, programStagesWithoutAccess } = useMemo(
        () =>
            events.reduce(
                (acc, event) => {
                    const { name, access } = programStages.find(p => p.id === event.programStage) || {};
                    const accKey = access.data.write ? 'programStagesWithActiveEvents' : 'programStagesWithoutAccess';

                    if (event.status === eventStatuses.ACTIVE) {
                        if (acc[accKey][event.programStage]) {
                            acc[accKey][event.programStage].count += 1;
                        } else {
                            acc[accKey][event.programStage] = {
                                count: 1,
                                name,
                            };
                        }
                    }
                    return acc;
                },
                { programStagesWithActiveEvents: {}, programStagesWithoutAccess: {} },
            ),
        [events, programStages],
    );

    const onHandleCompleteEnrollment = useCallback(() => {
        const completedEnrollment = {
            ...enrollment,
            status: plainStatus.COMPLETED,
        };

        onUpdateStatus(completedEnrollment, true);
    }, [onUpdateStatus, enrollment]);

    const onHandleCompleteEnrollmentAndEvents = useCallback(() => {
        const nowClient = fromClientDate(new Date());
        const nowServer = new Date(nowClient.getServerZonedISOString());
        const updatedAt = moment(nowServer).format('YYYY-MM-DDTHH:mm:ss');
        const eventsToComplete = events.reduce((acc, event) => {
            const { access } = programStages.find(p => p.id === event.programStage) || {};
            if (event.status === eventStatuses.ACTIVE && access.data.write) {
                return [...acc, { ...event, status: eventStatuses.COMPLETED, updatedAt }];
            }
            return acc;
        }, []);
        const completedEnrollment = {
            ...enrollment,
            status: plainStatus.COMPLETED,
            events: eventsToComplete,
        };

        onUpdateStatus(completedEnrollment, true);
    }, [events, onUpdateStatus, programStages, enrollment, fromClientDate]);

    return (
        <CompleteModalComponent
            programStagesWithActiveEvents={programStagesWithActiveEvents}
            programStagesWithoutAccess={programStagesWithoutAccess}
            setOpenCompleteModal={setOpenCompleteModal}
            onCompleteEnrollment={onHandleCompleteEnrollment}
            onCompleteEnrollmentAndEvents={onHandleCompleteEnrollmentAndEvents}
        />
    );
};
