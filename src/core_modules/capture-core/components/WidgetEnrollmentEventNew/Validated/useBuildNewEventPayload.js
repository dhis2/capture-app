// @flow
import { useSelector } from 'react-redux';
import { useTimeZoneConversion, useConfig } from '@dhis2/app-runtime';
import type { RenderFoundation } from '../../../metaData';
import { getAddEventEnrollmentServerData } from './getConvertedAddEvent';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { generateUID } from '../../../utils/uid/generateUID';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { getConvertedRelatedStageEvent } from './getConvertedRelatedStageEvent';
import type { LinkedRequestEvent, RelatedStageRefPayload, RequestEvent } from './validated.types';

type Props = {
    dataEntryId: string,
    itemId: string,
    orgUnitId: string,
    programId: string,
    formFoundation: RenderFoundation,
    enrollmentId: string,
    orgUnitName: string,
    teiId: string,
};

export const createServerData = ({
    clientRequestEvent,
    linkedEvent,
    relationship,
    enrollment,
}: {
    clientRequestEvent: RequestEvent,
    linkedEvent: ?LinkedRequestEvent,
    relationship: ?Object,
    enrollment: ?Object,
}) => {
    const relationships = relationship ? [relationship] : undefined;
    const newEvents = linkedEvent ? [clientRequestEvent, linkedEvent] : [clientRequestEvent];

    if (enrollment) {
        const updatedEnrollment = { ...enrollment, events: [...(enrollment.events || []), ...newEvents] };
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

export const useBuildNewEventPayload = ({
    dataEntryId,
    itemId,
    orgUnitId,
    programId,
    teiId,
    enrollmentId,
    orgUnitName,
    formFoundation,
}: Props) => {
    const { serverVersion: { minor } } = useConfig();
    const dataEntryKey = `${dataEntryId}-${itemId}`;
    const formValues = useSelector(({ formsValues }) => formsValues[dataEntryKey]);
    const dataEntryValues = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue[dataEntryKey]);
    const dataEntryValuesMeta = useSelector(({ dataEntriesFieldsMeta }) => dataEntriesFieldsMeta[dataEntryKey]);
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[dataEntryKey]);
    const { fromClientDate } = useTimeZoneConversion();

    const buildRelatedStageEventPayload = (clientRequestEvent, saveType: ?$Values<typeof addEventSaveTypes>, relatedStageRef) => {
        if (
            relatedStageRef.current
            && relatedStageRef.current.eventHasLinkableStageRelationship()
        ) {
            const isValid = relatedStageRef.current.formIsValidOnSave();
            if (!isValid || !relatedStageRef.current?.getLinkedStageValues) {
                return {
                    formHasError: true,
                    linkedEvent: null,
                    relationship: null,
                    linkMode: null,
                };
            }

            const { selectedRelationshipType, relatedStageDataValues, linkMode } = relatedStageRef.current
                .getLinkedStageValues();

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
                clientRequestEvent,
                relatedStageType: selectedRelationshipType,
                programId,
                currentProgramStageId: formFoundation.id,
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

    const buildNewEventPayload = (
        saveType: ?$Values<typeof addEventSaveTypes>,
        relatedStageRef: {| current: (?RelatedStageRefPayload) |},
    ) => {
        const requestEventId = generateUID();

        const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
            formFoundation,
            formValues,
            dataEntryValues,
            dataEntryValuesMeta,
        );
        const notesValues = notes ? notes.map(note => ({ value: note.value })) : [];

        const clientRequestEvent = getAddEventEnrollmentServerData({
            formFoundation,
            formClientValues,
            eventId: requestEventId,
            mainDataClientValues: { ...dataEntryClientValues, notes: notesValues },
            programId,
            orgUnitId,
            enrollmentId,
            teiId,
            orgUnitName,
            completed: saveType === addEventSaveTypes.COMPLETE,
            fromClientDate,
            serverMinorVersion: minor,
        });

        const {
            formHasError,
            linkedEvent,
            relationship,
            linkMode,
        } = buildRelatedStageEventPayload(clientRequestEvent, saveType, relatedStageRef);

        return {
            formHasError,
            clientRequestEvent,
            linkedEvent,
            relationship,
            linkMode,
        };
    };

    return {
        buildNewEventPayload,
    };
};
