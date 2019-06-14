// @flow
import moment from 'capture-core-utils/moment/momentResolver';
import convertDataEntryToClientValues from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { convertMainEventClientToServerWithKeysMap } from '../../../../../events/mainEventConverter';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';

const getApiCategoriesArgument = (categories: ?{ [id: string]: string}) => {
    if (!categories) {
        return null;
    }

    return {
        attributeCategoryOptions: Object
            .keys(categories)
            // $FlowSuppress
            .map(key => categories[key])
            .join(';'),
    };
};

export const getNewEventServerData = (state: ReduxState, formFoundation: RenderFoundation, formClientValues: Object, mainDataClientValues: Object) => {
    const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
    const mainDataServerValues: Object = convertMainEventClientToServerWithKeysMap(mainDataClientValues);

    if (mainDataServerValues.status === 'COMPLETED') {
        mainDataServerValues.completedDate = moment().format('YYYY-MM-DD');
    }

    return {
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
            })),
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
        prevEventMainData,
    );
    const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: getDataEntriesNotes(state, dataEntryKey) };

    return { formClientValues, mainDataClientValues };
};
