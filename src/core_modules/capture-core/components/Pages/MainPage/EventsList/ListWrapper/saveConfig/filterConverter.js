// @flow
import { getEventProgramThrowIfNotFound } from '../../../../../../metaData/helpers';
import { filterTypesObject as filterTypes } from '../../FilterSelectors/filterTypes';

const convertNumeric = (value: string) => {
    const valueArray = value.split(':');
    return {
        [valueArray[0]]: valueArray[1],
        [valueArray[2]]: valueArray[3],
    };
};

const convertDate = (value: string) => {
    
};

const converterForType = {
    [filterTypes.TEXT]: (value: string) => {
        const valueArray = value.split(':');
        return {
            [valueArray[0]]: valueArray[1],
        };
    },
    [filterTypes.NUMBER]: convertNumeric,
    [filterTypes.INTEGER]: convertNumeric,
    [filterTypes.INTEGER_POSITIVE]: convertNumeric,
    [filterTypes.INTEGER_NEGATIVE]: convertNumeric,
    [filterTypes.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [filterTypes.DATE]: (value: string) => {},
    [filterTypes.BOOLEAN]: (value: string) => {},
    [filterTypes.TRUE_ONLY]: (value: string) => {},
};

function convertValue(clientValue: any, type: $Values<typeof filterTypes>) {
    if (clientValue === undefined || clientValue === null) {
        return clientValue;
    }

    return converterForType[type] ? converterForType[type](clientValue) : clientValue;
}

function convertDataElementFilters(clientDataElementFilters: Object, programId: string) {
    const program = getEventProgramThrowIfNotFound(programId);
    const stage = program.stage;
    const convertedValues = stage.stageForm.convertValues(clientDataElementFilters, convertValue);

}

export function convertToApiFilters(clientFilters: ?Object, programId: string) {
    if (!clientFilters) {
        return null;
    }

    const { eventDate, status, assignee, ...dataElementFilters } = clientFilters;

}