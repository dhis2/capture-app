// @flow
import { pipe } from 'capture-core-utils';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import { ViewModeFieldForForm } from '../../Components';
import { convertFormToClient, convertClientToView } from '../../../../../converters';

const convertFn = pipe(convertFormToClient, convertClientToView);

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const getViewModeConfig = (dataElement: MetaDataElement, options: Object) => {
    const props = {
        valueConverter: (value: any) => dataElement.convertValue(value, convertFn),
        styles: baseComponentStyles,
        label: dataElement.formName,
        dataElement,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
    };

    return {
        id: dataElement.id,
        component: ViewModeFieldForForm,
        props,
    };
};

export default getViewModeConfig;
