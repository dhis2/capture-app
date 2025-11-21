import type { RenderFoundation } from '../../../metaData';
import { getAddEventEnrollmentServerData } from './getConvertedAddEvent';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { generateUID } from '../../../utils/uid/generateUID';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { getConvertedRelatedStageEvent } from '../../DataEntries';
import type { LinkedRequestEvent, RequestEvent } from '../../DataEntries';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';

type BuildPayloadArgs = {
    dataEntryId: string;
    itemId: string;
    programId: string;
    formFoundation: RenderFoundation;
    enrollmentId: string;
    teiId: string;
    fromClientDate: any;
};

const noRelatedStageEvent = {
    linkedEvent: null,
    relationship: null,
    linkMode: null,
};

export const createServerData = ({
    serverRequestEvent,
    linkedEvent,
    relationship,
    enrollment,
}: {
    serverRequestEvent: RequestEvent;
    linkedEvent: LinkedRequestEvent | null;
    relationship: Record<string, unknown> | null;
    enrollment?: Record<string, unknown>;
}) => {
    const relationships = relationship ? [relationship] : undefined;
    const newEvents = linkedEvent ? [serverRequestEvent, linkedEvent] : [serverRequestEvent];

    if (enrollment) {
        const updatedEnrollment = { ...enrollment, events: [...((enrollment as any).events || []), ...newEvents] };
        return {
            enrollments: [updatedEnrollment],
            relationships,
        };
    }

    return {
        events: newEvents,
        relationships,
    };
};

const buildRelatedStageEventPayload = (
    serverRequestEvent: any,
    relatedStageRef: any,
    currentProgramStageId: string,
    buildPayloadArgs: any,
) => {
    if (!(relatedStageRef?.current && relatedStageRef.current.eventHasLinkableStageRelationship()))
        return noRelatedStageEvent;

    const { selectedRelationshipType, relatedStageDataValues, linkMode } = relatedStageRef.current
        .getLinkedStageValues();

    if (!linkMode)
        return noRelatedStageEvent;

    const {
        programId,
        teiId,
        enrollmentId,
    } = buildPayloadArgs;

    const { linkedEvent, relationship } = getConvertedRelatedStageEvent({
        linkMode,
        relatedStageDataValues,
        serverRequestEvent,
        relatedStageType: selectedRelationshipType,
        programId,
        currentProgramStageId,
        teiId,
        enrollmentId,
    });

    return {
        linkedEvent,
        relationship,
        linkMode,
    };
};

export const buildNewEventPayload = ({
    buildPayloadArgs,
    state,
    saveType,
    relatedStageRef,
}: {
    buildPayloadArgs: BuildPayloadArgs;
    state: any;
    saveType?: typeof addEventSaveTypes[keyof typeof addEventSaveTypes];
    relatedStageRef?: { current: RelatedStageRefPayload | null };
}) => {
    const {
        dataEntryId,
        itemId,
        programId,
        teiId,
        enrollmentId,
        formFoundation,
        fromClientDate,
    } = buildPayloadArgs;

    const dataEntryKey = `${dataEntryId}-${itemId}`;
    const formValues = state.formsValues[dataEntryKey];
    const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
    const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
    const notes = state.dataEntriesNotes[dataEntryKey];

    const requestEventId = generateUID();

    const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
        formFoundation,
        formValues,
        dataEntryValues,
        dataEntryValuesMeta,
    );
    const notesValues = notes ? notes.map(note => ({ value: note.value })) : [];

    const serverRequestEvent = getAddEventEnrollmentServerData({
        formFoundation,
        formClientValues,
        eventId: requestEventId,
        mainDataClientValues: { ...dataEntryClientValues, notes: notesValues },
        programId,
        enrollmentId,
        teiId,
        completed: saveType === addEventSaveTypes.COMPLETE,
        fromClientDate,
    });

    const {
        linkedEvent,
        relationship,
        linkMode,
    } = buildRelatedStageEventPayload(serverRequestEvent, relatedStageRef, formFoundation.id, buildPayloadArgs);

    return {
        serverRequestEvent,
        linkedEvent,
        relationship,
        linkMode,
    };
};
