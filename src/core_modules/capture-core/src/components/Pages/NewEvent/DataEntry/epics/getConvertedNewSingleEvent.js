// @flow
import moment from '../../../../../utils/moment/momentResolver';
import convertDataEntryToClientValues from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { convertMainEventClientToServerWithKeysMap } from '../../../../../events/mainEventConverter';

export const getNewEventServerData = (state, formFoundation, formClientValues, mainDataClientValues) => {
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
        dataValues: Object
            .keys(formServerValues)
            .map(key => ({
                dataElement: key,
                value: formServerValues[key],
            })),
    };
};

export const getNewEventClientValues = (state, dataEntryKey, formFoundation) => {
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
    const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues };

    return { formClientValues, mainDataClientValues };
};
