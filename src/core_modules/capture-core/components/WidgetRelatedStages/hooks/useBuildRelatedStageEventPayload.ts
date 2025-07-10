import { getConvertedRelatedStageEvent, type RequestEvent, type LinkedRequestEvent } from '../../DataEntries';

export const createServerData = ({
    linkedEvent,
    relationship,
    enrollment,
}: {
    linkedEvent?: LinkedRequestEvent;
    relationship?: Record<string, unknown>;
    enrollment: any;
}) => {
    const exisitingEvents = enrollment.events.map((event: any) => (
        (event.event === (relationship as any)?.from?.event?.event || event.event === (relationship as any)?.to?.event?.event)
            ? { ...event, pendingApiResponse: true, relationships: [relationship], uid: event.event }
            : event
    ));

    if (linkedEvent) {
        return {
            events: [
                ...exisitingEvents,
                { ...linkedEvent, pendingApiResponse: true, relationships: [relationship], uid: (linkedEvent as any).event },
            ],
            relationships: [relationship],
        };
    }
    return {
        events: exisitingEvents,
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
        serverRequestEvent?: RequestEvent;
        relatedStageRef?: { current?: {
            eventHasLinkableStageRelationship: () => boolean;
            formIsValidOnSave: () => boolean;
            getLinkedStageValues: () => {
                linkMode?: any;
                relatedStageDataValues: any;
                selectedRelationshipType: any;
            };
        } | null };
        programStageId: string;
        programId: string;
        teiId: string;
        enrollmentId: string;
    }) => {
        if (relatedStageRef?.current?.eventHasLinkableStageRelationship()) {
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
