// @flow
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { convertDataEntryToClientValues } from '../../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../../../events/mainConverters';
import { type RenderFoundation } from '../../../../../../metaData';
import { deriveURLParamsFromLocation } from '../../../../../../utils/routing';

const getApiCategoriesArgument = (categories: ?{ [id: string]: string}) => {
    if (!categories) {
        return null;
    }

    return {
        attributeCategoryOptions: Object
            .keys(categories)

            .map(key => categories[key])
            .join(';'),
    };
};

export const getNewEventServerData = (state: ReduxState, formFoundation: RenderFoundation, formClientValues: Object, mainDataClientValues: Object) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);

    if (mainDataServerValues.status === 'COMPLETED') {
        mainDataServerValues.completedAt = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
    }

    return {
        events: [{
            ...mainDataServerValues,
            program: state.currentSelections.programId,
            programStage: formFoundation.id,
            orgUnit: state.currentSelections.orgUnitId,
            ...getApiCategoriesArgument(state.currentSelections.categories),
            dataValues: Object
                .keys(formServerValues)
                .map(key => ({
                    dataElement: key,
                    value: formServerValues[key],
                }))
                .filter(({ value }) => value != null),
        }],
    };
};

export const getAddEventEnrollmentServerData = (state: ReduxState,
    formFoundation: RenderFoundation,
    formClientValues: Object,
    mainDataClientValues: Object,
    history: Object,
    completed?: boolean,
) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);
    const { teiId, enrollmentId, programId, orgUnitId } = deriveURLParamsFromLocation();

    if (!mainDataServerValues.status) {
        mainDataServerValues.status = completed ? 'ACTIVE' : 'COMPLETED';
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
                trackedEntityInstance: teiId,
                enrollment: enrollmentId,
                ...getApiCategoriesArgument(state.currentSelections.categories),
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    })),
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
