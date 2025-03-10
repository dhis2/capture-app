// @flow
import moment from 'moment';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../events/mainConverters';
import { type RenderFoundation } from '../../../metaData';
import { FEATURES, featureAvailable } from '../../../../capture-core-utils';

export const getAddEventEnrollmentServerData = ({
    formFoundation,
    formClientValues,
    mainDataClientValues,
    eventId,
    programId,
    teiId,
    enrollmentId,
    completed,
    fromClientDate,
    uid,
}: {
    formFoundation: RenderFoundation,
    formClientValues: Object,
    mainDataClientValues: Object,
    eventId: string,
    programId: string,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
    fromClientDate: (date: Date) => { getServerZonedISOString: () => string },
    uid?: string,
}) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);
    const nowClient = fromClientDate(new Date());
    const nowServer = new Date(nowClient.getServerZonedISOString());
    const updatedAt = moment(nowServer).format('YYYY-MM-DDTHH:mm:ss');

    if (!mainDataServerValues.status) {
        mainDataServerValues.status = completed ? 'COMPLETED' : 'ACTIVE';
    }

    return {
        ...mainDataServerValues,
        event: eventId,
        program: programId,
        programStage: formFoundation.id,
        orgUnit: mainDataServerValues.orgUnit.id,
        orgUnitName: mainDataServerValues.orgUnit.name,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        ...(featureAvailable(FEATURES.sendEmptyScheduledAt) ? {} : { scheduledAt: mainDataServerValues.occurredAt }),
        updatedAt,
        uid,
        dataValues: Object
            .keys(formServerValues)
            .map(key => ({
                dataElement: key,
                value: formServerValues[key],
            }))
            .filter(({ value }) => value != null),
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
