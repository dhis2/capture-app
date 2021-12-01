// @flow
import type { ValidatorContainer } from 'capture-ui/FormBuilder/FormBuilder.component';
import { type ComponentType } from 'react';
import type { DataElement } from '../../../../../metaData';
import { getValidators } from '../../validators';

export type FieldConfigForType = {
    component: ComponentType<any>,
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

export const getBaseConfigForField = (metaData: DataElement) => ({
    id: metaData.id,
    validators: getValidators(metaData),
    commitEvent: commitEvents.ON_BLUR,
});
