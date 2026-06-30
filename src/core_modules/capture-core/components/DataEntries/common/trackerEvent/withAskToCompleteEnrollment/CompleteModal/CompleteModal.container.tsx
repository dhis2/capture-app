import React, { useMemo, useCallback } from 'react';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { formatMomentEn } from 'capture-core-utils/date';
import i18n from '@dhis2/d2-i18n';
import { getTrackerProgramThrowIfNotFound, useProgramLabel, useStageLabel } from '../../../../../../metaData';
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
    const enrollmentLabel = useProgramLabel('enrollment', { programId }) ?? i18n.t('enrollment');
    const eventSingularLabel = useStageLabel('event', { programId }) ?? i18n.t('event');
    const eventPluralLabel = useStageLabel('event', { programId, plural: true }) ?? i18n.t('events');
    const programStages = useMemo(() => {
        const program = getTrackerProgramThrowIfNotFound(programId);
        return [...program.stages.values()];
    }, [programId]);

    const { programStagesWithActiveEvents, programStagesWithoutAccess } = useMemo(
        () =>
            events.reduce(
                (acc: any, event: any) => {
                    const { name, access } = programStages.find((p: any) => p.id === event.programStage) || {};
                    const accKey = access?.data?.write ? 'programStagesWithActiveEvents' : 'programStagesWithoutAccess';

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
        const updatedAt = formatMomentEn(nowServer, 'YYYY-MM-DDTHH:mm:ss');
        const eventsToComplete = events.reduce((acc: any, event: any) => {
            const { access } = programStages.find((p: any) => p.id === event.programStage) || {};
            const isCurrentEvent = eventId && event.event === eventId;
            if (event.status === eventStatuses.ACTIVE && access?.data?.write && !isCurrentEvent) {
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
            enrollmentLabel={enrollmentLabel}
            eventSingularLabel={eventSingularLabel}
            eventPluralLabel={eventPluralLabel}
            programStagesWithActiveEvents={programStagesWithActiveEvents}
            programStagesWithoutAccess={programStagesWithoutAccess}
            onCancel={onCancel}
            onCompleteEnrollmentAndEvents={onHandleCompleteEnrollmentAndEvents}
            onCompleteEnrollment={onHandleCompleteEnrollment}
        />
    ) : (
        <CompleteEnrollmentModalComponent
            programStageName={programStageName}
            enrollmentLabel={enrollmentLabel}
            onCancel={onCancel}
            onCompleteEnrollment={onHandleCompleteEnrollment}
        />
    );
};
