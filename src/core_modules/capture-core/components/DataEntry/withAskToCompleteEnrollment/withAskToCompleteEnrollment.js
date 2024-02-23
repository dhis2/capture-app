// @flow
import React, { useState, useRef, useMemo } from 'react';
import { type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { CompleteModal } from './CompleteModal';
import { statusTypes as eventStatuses } from '../../../events/statusTypes';
import { type RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';

type Props = {
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => void,
    remindCompleted?: ?boolean,
    isCompleted?: boolean,
    formFoundation: RenderFoundation,
    onSaveAndCompleteEnrollment: (
        eventId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        enrollment: string,
    ) => void,
};

const getAskToCompleteEnrollment = (InnerComponent: ComponentType<any>) => (props: Props) => {
    const { remindCompleted, onSave, isCompleted, onSaveAndCompleteEnrollment, ...passOnProps } = props;
    const enrollment = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const events = enrollment.events;
    const hasActiveEvents = useMemo(() => events.some(event => event.status === eventStatuses.ACTIVE), [events]);
    const [isOpenCompleteModal, setOpenCompleteModal] = useState(false);
    const eventDataToSave = useRef({});

    const handleOnSaveEvent = () => {
        setOpenCompleteModal(false);
        const { eventId, dataEntryId, formFoundation, saveType } = eventDataToSave.current;
        onSave(eventId, dataEntryId, formFoundation, saveType);
    };

    const handleCompleteEnrollment = (updatedEnrollment) => {
        setOpenCompleteModal(false);
        const { eventId, dataEntryId, formFoundation } = eventDataToSave.current;
        onSaveAndCompleteEnrollment(eventId, dataEntryId, formFoundation, updatedEnrollment);
    };

    const handleOnSave = (
        eventId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        saveType?: string,
    ) => {
        eventDataToSave.current = { eventId, dataEntryId, formFoundation, saveType };
        if (remindCompleted && (isCompleted || saveType === addEventSaveTypes.COMPLETE)) {
            setOpenCompleteModal(true);
        } else {
            onSave(eventId, dataEntryId, formFoundation, saveType);
        }
    };

    return (
        <>
            <InnerComponent
                {...passOnProps}
                remindCompleted={remindCompleted}
                onSave={handleOnSave}
                isCompleted={isCompleted}
            />
            {isOpenCompleteModal && (
                <CompleteModal
                    programId={enrollment?.program}
                    onCancel={handleOnSaveEvent}
                    onCompleteEnrollment={handleCompleteEnrollment}
                    enrollment={enrollment}
                    events={events}
                    hasActiveEvents={hasActiveEvents}
                    programStageName={passOnProps.formFoundation.name}
                />
            )}
        </>
    );
};

export const withAskToCompleteEnrollment = () => (InnerComponent: ComponentType<any>) =>
    getAskToCompleteEnrollment(InnerComponent);
