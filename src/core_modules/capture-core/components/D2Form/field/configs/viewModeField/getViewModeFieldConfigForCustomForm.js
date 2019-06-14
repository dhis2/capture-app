// @flow
import { pipe } from 'capture-core-utils';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';
import { ViewModeFieldForCustomForm } from '../../Components';
import { convertFormToClient, convertClientToView } from '../../../../../converters';

const convertFn = pipe(convertFormToClient, convertClientToView);

const getViewModeConfig = (dataElement: MetaDataElement, options: Object) => {
    const props = {
        valueConverter: (value: any) => dataElement.convertValue(value, convertFn),
        label: dataElement.formName,
        dataElement,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
    };

    return {
        id: dataElement.id,
        component: ViewModeFieldForCustomForm,
        props,
    };
};

export default getViewModeConfig;
