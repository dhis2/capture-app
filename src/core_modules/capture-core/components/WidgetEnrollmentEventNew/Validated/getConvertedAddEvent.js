// @flow
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../events/mainConverters';
import { type RenderFoundation } from '../../../metaData';

export const getAddEventEnrollmentServerData = ({
    formFoundation,
    formClientValues,
    mainDataClientValues,
    programId,
    orgUnitId,
    orgUnitName,
    teiId,
    enrollmentId,
    completed,
}: {
    formFoundation: RenderFoundation,
    formClientValues: Object,
    mainDataClientValues: Object,
    programId: string,
    orgUnitId: string,
    orgUnitName: string,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
}) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);

    if (!mainDataServerValues.status) {
        mainDataServerValues.status = completed ? 'COMPLETED' : 'ACTIVE';
    }
    if (mainDataServerValues.status === 'COMPLETED') {
        mainDataServerValues.completedAt = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
    }

    return {
        events: [
            {
                ...mainDataServerValues,
                program: programId,
                programStage: formFoundation.id,
                orgUnit: orgUnitId,
                trackedEntity: teiId,
                enrollment: enrollmentId,
                scheduledAt: mainDataServerValues.occurredAt,
                orgUnitName,
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    }))
                    .filter(({ value }) => value != null),
            },
        ],
    };
};

function getDataEntriesNotes(state: ReduxState, dataEntryKey: string) {
    const notes = state.dataEntriesNotes && state.dataEntriesNotes[dataEntryKey];
    return notes ? notes.map(note => ({ value: note.value })) : [];
}

export const getNewEventClientValues = (state: ReduxState, dataEntryKey: string, formFoundation: RenderFoundation) => {
    const formValues = state.formsValues[dataEntryKey];
    const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
    const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
    const prevEventMainData = {};

    const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
        formFoundation,
        formValues,
        dataEntryValues,
        dataEntryValuesMeta,
    );
    const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: getDataEntriesNotes(state, dataEntryKey) };

    return { formClientValues, mainDataClientValues };
};
