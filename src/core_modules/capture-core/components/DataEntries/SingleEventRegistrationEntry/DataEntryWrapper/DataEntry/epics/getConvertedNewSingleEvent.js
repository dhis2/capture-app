// @flow
import { convertDataEntryToClientValues } from '../../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../../../events/mainConverters';
import { type RenderFoundation } from '../../../../../../metaData';
import { getLocationQuery } from '../../../../../../utils/routing';
import { FEATURES, featureAvailable } from '../../../../../../../capture-core-utils';

const getApiCategoriesArgument = (categories: ?{ [id: string]: string}) => {
    if (!categories) {
        return null;
    }
    const newUIDsSeparator = featureAvailable(FEATURES.newUIDsSeparator);

    return {
        attributeCategoryOptions: Object
            .keys(categories)

            .map(key => categories[key])
            .join(newUIDsSeparator ? ',' : ';'),
    };
};

export const getNewEventServerData = (state: ReduxState, formFoundation: RenderFoundation, formClientValues: Object, mainDataClientValues: Object) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);

    return {
        events: [{
            ...mainDataServerValues,
            program: state.currentSelections.programId,
            programStage: formFoundation.id,
            orgUnit: mainDataServerValues.orgUnit.id,
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
    const { teiId, enrollmentId, programId, orgUnitId } = getLocationQuery();

    if (!mainDataServerValues.status) {
        mainDataServerValues.status = completed ? 'ACTIVE' : 'COMPLETED';
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
