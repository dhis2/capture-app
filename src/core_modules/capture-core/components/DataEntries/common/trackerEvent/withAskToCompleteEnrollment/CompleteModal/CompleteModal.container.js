// @flow
import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { getTrackerProgramThrowIfNotFound } from '../../../../../../metaData';
import { statusTypes } from '../../../../../../enrollment';
import { statusTypes as eventStatuses } from '../../../../../../events/statusTypes';
import { CompleteEnrollmentAndEventsModalComponent, CompleteEnrollmentModalComponent } from './CompleteModal.component';
import type { Props } from './completeModal.types';

export const CompleteModal = ({
    programId,
    eventId,
    enrollment,
    events,
    onCancel,
    onCompleteEnrollment,
    hasActiveEvents,
    programStageName,
}: Props) => {
    const { fromClientDate } = useTimeZoneConversion();
    const programStages = useMemo(() => {
        const program = getTrackerProgramThrowIfNotFound(programId);
        return [...program.stages.values()];
    }, [programId]);

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
        const { events: eventsToKeep, ...rest } = enrollment;
        onCompleteEnrollment({ ...rest, status: statusTypes.COMPLETED });
    }, [enrollment, onCompleteEnrollment]);

    const onHandleCompleteEnrollmentAndEvents = useCallback(() => {
        const nowClient = fromClientDate(new Date());
        const nowServer = new Date(nowClient.getServerZonedISOString());
        const updatedAt = moment(nowServer).format('YYYY-MM-DDTHH:mm:ss');
        const eventsToComplete = events.reduce((acc, event) => {
            const { access } = programStages.find(p => p.id === event.programStage) || {};
            const isCurrentEvent = eventId && event.event === eventId;
            if (event.status === eventStatuses.ACTIVE && access.data.write && !isCurrentEvent) {
                return [...acc, { ...event, status: eventStatuses.COMPLETED, updatedAt }];
            }
            return acc;
        }, []);

        const enrollmentWithCompletedEvents = {
            ...enrollment,
            status: statusTypes.COMPLETED,
            events: eventsToComplete,
        };
        onCompleteEnrollment(enrollmentWithCompletedEvents);
    }, [events, programStages, enrollment, onCompleteEnrollment, fromClientDate, eventId]);

    return hasActiveEvents ? (
        <CompleteEnrollmentAndEventsModalComponent
            programStageName={programStageName}
            programStagesWithActiveEvents={programStagesWithActiveEvents}
            programStagesWithoutAccess={programStagesWithoutAccess}
            onCancel={onCancel}
            onCompleteEnrollmentAndEvents={onHandleCompleteEnrollmentAndEvents}
            onCompleteEnrollment={onHandleCompleteEnrollment}
        />
    ) : (
        <CompleteEnrollmentModalComponent
            programStageName={programStageName}
            onCancel={onCancel}
            onCompleteEnrollment={onHandleCompleteEnrollment}
        />
    );
};
