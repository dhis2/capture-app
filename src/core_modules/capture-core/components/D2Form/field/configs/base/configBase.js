// @flow
import { type ComponentType } from 'react';
import type { ValidatorContainer } from '../../../FormBuilder';
import { getValidators } from '../../validators';
import type { DataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

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

export const getBaseConfigForField = (metaData: DataElement, querySingleResource: QuerySingleResource) => ({
    id: metaData.id,
    validators: getValidators(metaData, querySingleResource),
    commitEvent: commitEvents.ON_BLUR,
});
