import React, { useCallback, useMemo } from 'react';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { useServerFormattedNow } from 'capture-core/hooks';
import { CompleteModalComponent } from './CompleteModal.component';
import { plainStatus } from '../../../constants/status.const';
import type { Props } from './completeModal.types';

export const CompleteModal = ({ enrollment, events, programStages, setOpenCompleteModal, onUpdateStatus }: Props) => {
    const getUpdatedAt = useServerFormattedNow();
    const { programStagesWithActiveEvents, programStagesWithoutAccess } = useMemo(
        () =>
            events.reduce(
                (acc, event) => {
                    const { name, access } = programStages.find(p => p.id === event.programStage) || {} as any;
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
        const updatedAt = getUpdatedAt();
        const eventsToComplete = events.reduce((acc, event) => {
            const { access } = programStages.find(p => p.id === event.programStage) || {} as any;
            if (event.status === eventStatuses.ACTIVE && access.data.write) {
                return [...acc, { ...event, status: eventStatuses.COMPLETED, updatedAt }];
            }
            return acc;
        }, [] as any[]);
        const completedEnrollment = {
            ...enrollment,
            status: plainStatus.COMPLETED,
            events: eventsToComplete,
        };

        onUpdateStatus(completedEnrollment, true);
    }, [events, onUpdateStatus, programStages, enrollment, getUpdatedAt]);

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
