// @flow
import { errorCreator } from 'capture-core-utils';
import { effectActions } from '@dhis2/rules-engine-javascript';
import log from 'loglevel';
import type { AssignOutputEffect } from '@dhis2/rules-engine-javascript';
import { type DataElement } from '../metaData';
import type { QuerySingleResource } from '../utils/api';
import { getValidators } from '../utils/validation/getValidators';
import type { Validations } from '../utils/validation/validateValue';
import { validateValue } from '../utils/validation/validateValue';

export type AssignOutputEffectWithValidations = {
    [metaDataId: string]: Array<AssignOutputEffect & Validations>,
};

export const validateAssignEffects = async ({
    dataElements,
    effects,
    querySingleResource,
    onGetValidationContext,
}: {
    dataElements: Array<DataElement>,
    effects: Object,
    querySingleResource: QuerySingleResource,
    onGetValidationContext?: () => Object,
}): Promise<?AssignOutputEffectWithValidations> => {
    const assignEffects: {| [metaDataId: string]: Array<AssignOutputEffect> |} = effects[effectActions.ASSIGN_VALUE];
    if (!assignEffects) {
        return effects;
    }

    const assignEffectsWithValidations = await dataElements.reduce(async (passPromise, metaData: DataElement) => {
        const acc = await passPromise;
        if (!assignEffects[metaData.id]) {
            return acc;
        }

        const effectsForId = assignEffects[metaData.id];
        const lastIndex = effectsForId.length - 1;
        const value = effectsForId[lastIndex].value;
        const validators = getValidators(metaData, querySingleResource);
        const validationContext = onGetValidationContext && onGetValidationContext();

        try {
            const validatorResult = await validateValue({ validators }, value, validationContext);
            const effectWithValidation = Object.assign({}, effectsForId[lastIndex], validatorResult);

            acc[metaData.id] = [effectWithValidation];
            return acc;
        } catch (error) {
            log.error(
                errorCreator('an error occured while validating the assigned program rule effect')({
                    metaData,
                    lastIndex,
                    error,
                }),
            );
            return acc;
        }
    }, Promise.resolve({}));

    return { ...effects, [effectActions.ASSIGN_VALUE]: assignEffectsWithValidations };
};
