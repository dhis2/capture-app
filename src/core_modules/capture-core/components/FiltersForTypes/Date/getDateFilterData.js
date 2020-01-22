// @flow
import { mainOptionKeys } from './mainOptions';
import { dataElementTypes as elementTypes } from '../../../metaData';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';

type Value = {
    main: string,
    from?: ?string,
    to?: ?string,
}

const filterTypes = {
    ABSOLUTE: 'ABSOLUTE',
    RELATIVE: 'RELATIVE',
};

const convertDateFilterValueToClientValue = (formValue: string): string =>
    // $FlowFixMe
    convertToClientValue(formValue, elementTypes.DATE);

const converterForMainSelections = {
    [mainOptionKeys.CUSTOM_RANGE]: (fromValue: ?string, toValue: ?string) => {
        const rangeData: AbsoluteDateFilterData = {
            type: filterTypes.ABSOLUTE,
        };

        if (fromValue) {
            const fromClientValue: string = convertDateFilterValueToClientValue(fromValue);
            rangeData.ge = fromClientValue;
        }

        if (toValue) {
            const toClientValue: string = convertDateFilterValueToClientValue(toValue);
            rangeData.le = toClientValue;
        }

        return rangeData;
    },
};

function convertSelections(value: Value) {
    return converterForMainSelections[value.main] ?
        converterForMainSelections[value.main](value.from, value.to) :
        { type: filterTypes.RELATIVE, period: value.main };
}

export default function getDateFilterData(value: Value) {
    return convertSelections(value);
}
