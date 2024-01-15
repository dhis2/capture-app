// @flow
import { useSelector } from 'react-redux';
import type { RenderFoundation } from '../../../metaData';
import { getAddEventEnrollmentServerData } from './getConvertedAddEvent';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { generateUID } from '../../../utils/uid/generateUID';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { getConvertedReferralEvent } from './getConvertedReferralEvent';
import type { ReferralRefPayload } from './validated.types';

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
    const dataEntryKey = `${dataEntryId}-${itemId}`;
    const formValues = useSelector(({ formsValues }) => formsValues[dataEntryKey]);
    const dataEntryValues = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue[dataEntryKey]);
    const dataEntryValuesMeta = useSelector(({ dataEntriesFieldsMeta }) => dataEntriesFieldsMeta[dataEntryKey]);
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[dataEntryKey]);

    const buildReferralEventPayload = (clientRequestEvent, saveType: ?$Values<typeof addEventSaveTypes>, referralRef) => {
        if (
            referralRef.current
            && saveType === addEventSaveTypes.COMPLETE
            && referralRef.current.eventHasReferralRelationship()
        ) {
            const isValid = referralRef.current.formIsValidOnSave();
            if (!isValid || !referralRef.current?.getReferralValues) {
                return {
                    formHasError: true,
                    referralEvent: null,
                    relationship: null,
                    referralMode: null,
                };
            }

            const { referralType, referralValues, referralMode } = referralRef.current
                .getReferralValues(clientRequestEvent.event);

            const { referralEvent, relationship } = getConvertedReferralEvent({
                referralMode,
                referralDataValues: referralValues,
                clientRequestEvent,
                referralType,
                programId,
                currentProgramStageId: formFoundation.id,
                teiId,
                enrollmentId,
            });

            return {
                formHasError: false,
                referralEvent,
                relationship,
                referralMode,
            };
        }
        return {
            formHasError: false,
            referralEvent: null,
            relationship: null,
            referralMode: null,
        };
    };

    const buildNewEventPayload = (
        saveType: ?$Values<typeof addEventSaveTypes>,
        referralRef: {| current: (ReferralRefPayload | null) |},
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
        });

        const {
            formHasError,
            referralEvent,
            relationship,
            referralMode,
        } = buildReferralEventPayload(clientRequestEvent, saveType, referralRef);

        return {
            formHasError,
            clientRequestEvent,
            referralEvent,
            relationship,
            referralMode,
        };
    };

    return {
        buildNewEventPayload,
    };
};
