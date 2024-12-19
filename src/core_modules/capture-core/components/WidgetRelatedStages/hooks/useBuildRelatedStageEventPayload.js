// @flow
import { getConvertedRelatedStageEvent, type RequestEvent, type LinkedRequestEvent } from '../../DataEntries';
import type { RelatedStageRefPayload } from '../index';

export const createServerData = ({
    linkedEvent,
    relationship,
    enrollment,
}: {
    linkedEvent: ?LinkedRequestEvent,
    relationship: ?Object,
    enrollment: Object,
}) => {
    const updatedEnrollment = { ...enrollment, events: [...enrollment.events, linkedEvent] };
    if (linkedEvent) {
        return {
            enrollments: [updatedEnrollment],
            relationships: [relationship],
        };
    }
    return {
        relationships: [relationship],
    };
};

export const useBuildRelatedStageEventPayload = () => {
    const buildRelatedStageEventPayload = ({
        serverRequestEvent,
        relatedStageRef,
        programStageId,
        programId,
        teiId,
        enrollmentId,
    }: {
        serverRequestEvent: ?RequestEvent,
        relatedStageRef?: { current: ?RelatedStageRefPayload },
        programStageId: string,
        programId: string,
        teiId: string,
        enrollmentId: string,
    }) => {
        if (relatedStageRef?.current && relatedStageRef.current.eventHasLinkableStageRelationship()) {
            const isValid = relatedStageRef.current.formIsValidOnSave();

            if (!isValid || !relatedStageRef.current?.getLinkedStageValues || !programStageId || !serverRequestEvent) {
                return {
                    formHasError: true,
                    linkedEvent: null,
                    relationship: null,
                    linkMode: null,
                };
            }

            const { selectedRelationshipType, relatedStageDataValues, linkMode } =
                relatedStageRef.current.getLinkedStageValues();

            if (!linkMode) {
                return {
                    formHasError: false,
                    linkedEvent: null,
                    relationship: null,
                    linkMode: null,
                };
            }

            const { linkedEvent, relationship } = getConvertedRelatedStageEvent({
                linkMode,
                relatedStageDataValues,
                serverRequestEvent,
                relatedStageType: selectedRelationshipType,
                programId,
                currentProgramStageId: programStageId,
                teiId,
                enrollmentId,
            });

            return {
                formHasError: false,
                linkedEvent,
                relationship,
                linkMode,
            };
        }
        return {
            formHasError: false,
            linkedEvent: null,
            relationship: null,
            linkMode: null,
        };
    };

    return {
        buildRelatedStageEventPayload,
    };
};
