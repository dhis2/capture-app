// @flow
import * as React from 'react';
import type { ValidatorContainer } from '../../../../FormBuilder/FormBuilder.component';
import { getValidators } from '../../validators';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

export type FieldConfigForType = {
    component: React.ComponentType<any>,
    props?: ?Object,
    id?: string,
    validators?: Array<ValidatorContainer>,
    commitEvent?: ?string,
    onIsEqual?: ?(newValue: any, oldValue: any) => boolean,
};

export const convertPx = (options: Object, value: number) => {
    const pxToRem = options && options.theme && options.theme.typography.pxToRem;
    return pxToRem ? pxToRem(value) : value;
};

export const commitEvents = {
    ON_BLUR: 'onBlur',
};

export const getBaseConfigForField = (metaData: MetaDataElement) => ({
    id: metaData.id,
    validators: getValidators(metaData),
    commitEvent: commitEvents.ON_BLUR,
});
