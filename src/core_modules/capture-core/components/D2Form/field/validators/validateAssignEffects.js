// @flow
import { errorCreator } from 'capture-core-utils';
import { effectActions } from '@dhis2/rules-engine-javascript';
import log from 'loglevel';
import type { AssignOutputEffect } from '@dhis2/rules-engine-javascript';
import { type DataElement } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api';
import { getValidators } from './getValidators';

export type AssignOutputEffectWithValidations = {
    [metaDataId: string]: Array<AssignOutputEffect & { valid: boolean, errorMessage?: string, errorType?: string, errorData?: string }>,
};

const getValidatorsResult = async (validators, value, validationContext) =>
    validators.reduce(async (passPromise, currentValidator) => {
        const pass = await passPromise;
        if (pass === true) {
            if (!currentValidator) {
                return true;
            }
            const result: Object = currentValidator.validator(value, validationContext);

            if (result === true || (result && result.valid)) {
                return true;
            }
            return {
                message: result.errorMessage || currentValidator.message,
                type: currentValidator.type,
                data: result.data,
            };
        }
        return pass;
    }, Promise.resolve(true));

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
    const assignEffects: { [metaDataId: string]: Array<AssignOutputEffect> } = effects[effectActions.ASSIGN_VALUE];
    if (!assignEffects) {
        return effects;
    }

    const assignEffectsWithValidations = await dataElements.reduce(async (passPromise, metaData: DataElement) => {
        const acc = await passPromise;
        if (assignEffects[metaData.id]) {
            const effectsForId = assignEffects[metaData.id];
            const lastEffect = effectsForId.length - 1;
            const value = effectsForId[lastEffect].value;
            const validators = getValidators(metaData, querySingleResource);
            const validationContext = onGetValidationContext && onGetValidationContext();

            try {
                const validatorResult = await getValidatorsResult(validators, value, validationContext);
                const effectWithValidation = validatorResult === true
                    ? {
                        ...effectsForId[lastEffect],
                        valid: true,
                    }
                    : {
                        ...effectsForId[lastEffect],
                        valid: false,
                        errorMessage: validatorResult.message,
                        errorType: validatorResult.type,
                        errorData: validatorResult.data,
                    };

                acc[metaData.id] = [...effectsForId.slice(0, lastEffect - 1), effectWithValidation];
                return acc;
            } catch (error) {
                log.error(
                    errorCreator('an error occured while validating the assigned program rule effect')({
                        metaData,
                        lastEffect,
                        error,
                    }),
                );
                return acc;
            }
        }
        return acc;
    }, Promise.resolve({}));

    return { ...effects, [effectActions.ASSIGN_VALUE]: assignEffectsWithValidations };
};
