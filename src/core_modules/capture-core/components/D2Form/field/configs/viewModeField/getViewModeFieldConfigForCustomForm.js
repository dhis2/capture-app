// @flow
import { pipe } from 'capture-core-utils';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { ViewModeFieldForCustomForm } from '../../Components';
import { convertFormToClient, convertClientToView } from '../../../../../converters';

const convertFn = pipe(convertFormToClient, convertClientToView);

export const getViewModeFieldConfigForCustomForm = (dataElement: MetaDataElement, options: Object) => {
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
