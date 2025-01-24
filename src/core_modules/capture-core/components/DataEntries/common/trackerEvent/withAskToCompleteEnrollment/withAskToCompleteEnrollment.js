// @flow
import React, { useState, useRef, useMemo } from 'react';
import { type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { CompleteModal } from './CompleteModal';
import { statusTypes as eventStatuses } from '../../../../../events/statusTypes';
import { type RenderFoundation } from '../../../../../metaData';
import { addEventSaveTypes } from '../../../../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';
import { actions as LinkModes } from '../../../../WidgetRelatedStages/constants';
import type { RelatedStageRefPayload } from '../../../../WidgetEnrollmentEventNew/Validated/validated.types';

type Props = {
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => void,
    askCompleteEnrollmentOnEventComplete?: ?boolean,
    isCompleted?: boolean,
    eventId?: ?string,
    formFoundation: RenderFoundation,
    relatedStageRef: { current?: ?RelatedStageRefPayload },
    onSaveAndCompleteEnrollment: (
        eventId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        enrollment: string,
    ) => void,
};

const getAskToCompleteEnrollment = (InnerComponent: ComponentType<any>) => (props: Props) => {
    const {
        askCompleteEnrollmentOnEventComplete,
        onSave,
        isCompleted,
        onSaveAndCompleteEnrollment,
        eventId,
        relatedStageRef,
        ...passOnProps
    } = props;
    const enrollment = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const events = enrollment?.events;
    const hasActiveEvents = useMemo(() => events?.some(event => event.status === eventStatuses.ACTIVE), [events]);
    const [isOpenCompleteModal, setOpenCompleteModal] = useState(false);
    const eventDataToSave = useRef({});

    const handleOnSaveEvent = () => {
        setOpenCompleteModal(false);
        const { itemId, dataEntryId, formFoundation, saveType } = eventDataToSave.current;
        onSave(itemId, dataEntryId, formFoundation, saveType);
    };

    const handleCompleteEnrollment = (updatedEnrollment) => {
        setOpenCompleteModal(false);
        const { itemId, dataEntryId, formFoundation } = eventDataToSave.current;
        onSaveAndCompleteEnrollment(itemId, dataEntryId, formFoundation, updatedEnrollment);
    };

    const handleOnSave = (
        itemId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        saveType?: string,
    ) => {
        const { linkMode } = relatedStageRef?.current?.getLinkedStageValues() ?? {};
        eventDataToSave.current = { itemId, dataEntryId, formFoundation, saveType };
        if (askCompleteEnrollmentOnEventComplete && (isCompleted || saveType === addEventSaveTypes.COMPLETE) && linkMode !== LinkModes.ENTER_DATA) {
            setOpenCompleteModal(true);
        } else {
            onSave(itemId, dataEntryId, formFoundation, saveType);
        }
    };

    return (
        <>
            <InnerComponent
                {...passOnProps}
                relatedStageRef={relatedStageRef}
                askCompleteEnrollmentOnEventComplete={askCompleteEnrollmentOnEventComplete}
                onSave={handleOnSave}
                isCompleted={isCompleted}
            />
            {isOpenCompleteModal && (
                <CompleteModal
                    programId={enrollment?.program}
                    eventId={eventId}
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
