import { useSelector } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import type { RenderFoundation } from '../../../metaData';
import { getAddEventEnrollmentServerData } from './getConvertedAddEvent';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { generateUID } from '../../../utils/uid/generateUID';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { getConvertedRelatedStageEvent } from '../../DataEntries';
import type { LinkedRequestEvent, RequestEvent } from '../../DataEntries';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';

type Props = {
    dataEntryId: string;
    itemId: string;
    programId: string;
    formFoundation: RenderFoundation;
    enrollmentId: string;
    teiId: string;
};

export const createServerData = ({
    serverRequestEvent,
    linkedEvent,
    relationship,
    enrollment,
}: {
    serverRequestEvent: RequestEvent;
    linkedEvent?: LinkedRequestEvent;
    relationship?: Record<string, unknown>;
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

export const useBuildNewEventPayload = ({
    dataEntryId,
    itemId,
    programId,
    teiId,
    enrollmentId,
    formFoundation,
}: Props) => {
    const dataEntryKey = `${dataEntryId}-${itemId}`;
    const formValues = useSelector((state: any) => state.formsValues[dataEntryKey]);
    const dataEntryValues = useSelector((state: any) => state.dataEntriesFieldsValue[dataEntryKey]);
    const dataEntryValuesMeta = useSelector((state: any) => state.dataEntriesFieldsMeta[dataEntryKey]);
    const notes = useSelector((state: any) => state.dataEntriesNotes[dataEntryKey]);
    const { fromClientDate } = useTimeZoneConversion();

    const buildRelatedStageEventPayload = (serverRequestEvent: any, relatedStageRef: any) => {
        if (
            relatedStageRef?.current
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
                serverRequestEvent,
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
        saveType?: keyof typeof addEventSaveTypes,
        relatedStageRef?: { current: RelatedStageRefPayload | null },
    ) => {
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
            fromClientDate: fromClientDate as any,
        });

        const {
            formHasError,
            linkedEvent,
            relationship,
            linkMode,
        } = buildRelatedStageEventPayload(serverRequestEvent, relatedStageRef);

        return {
            formHasError,
            serverRequestEvent,
            linkedEvent,
            relationship,
            linkMode,
        };
    };

    return {
        buildNewEventPayload,
    };
};
