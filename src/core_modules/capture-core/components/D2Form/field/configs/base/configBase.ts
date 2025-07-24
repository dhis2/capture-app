
import { type ComponentType } from 'react';
import type { ValidatorContainer } from '../../../../../utils/validation';
import { getValidators } from '../../../../../utils/validation';
import type { DataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export type FieldConfigForType = {
    component: ComponentType<any>,
    props: any | null,
    id?: string,
    validators?: Array<ValidatorContainer>,
    commitEvent?: string | null,
    onIsEqual?: (newValue: any, oldValue: any) => boolean,
};

export const convertPx = (options: any, value: number) => {
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
