import { rulesEngineEffectTargetDataTypes, typeKeys } from '../constants';
import type { DataElements, TrackedEntityAttributes, HideOutputEffect } from '../types/ruleEngine.types';

const processDataElementValue = ({
    dataElementId,
    dataElements,
}: {
    dataElementId: string | null;
    dataElements: DataElements | null;
}) => {
    const dataElement = dataElementId && dataElements?.[dataElementId];
    if (dataElement) {
        return {
            name: dataElement.name,
            valueType: dataElement.valueType,
        };
    }
    return null;
};

const processTEAValue = ({
    trackedEntityAttributeId,
    trackedEntityAttributes,
}: {
    trackedEntityAttributeId: string | null;
    trackedEntityAttributes: TrackedEntityAttributes | null;
}) => {
    const attribute = trackedEntityAttributeId && trackedEntityAttributes?.[trackedEntityAttributeId];
    if (attribute) {
        return {
            name: attribute.displayFormName || attribute.displayName,
            valueType: attribute.valueType,
        };
    }
    return null;
};

const mapByTargetDataTypes = Object.freeze({
    [rulesEngineEffectTargetDataTypes.DATA_ELEMENT]: processDataElementValue,
    [rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE]: processTEAValue,
});

export const getOutputEffectsWithPreviousValueCheck = ({
    outputEffects,
    formValues,
    dataElementId,
    trackedEntityAttributeId,
    dataElements,
    trackedEntityAttributes,
    onProcessValue,
}: {
    outputEffects: Array<HideOutputEffect>;
    dataElementId: string | null;
    trackedEntityAttributeId: string | null;
    dataElements: DataElements | null;
    trackedEntityAttributes: TrackedEntityAttributes | null;
    formValues?: { [key: string]: any } | null;
    onProcessValue: (value: any, type: typeof typeKeys[keyof typeof typeKeys]) => any;
}) =>
    outputEffects.reduce((acc: Array<HideOutputEffect>, outputEffect) => {
        if (formValues && Object.keys(formValues).length !== 0 && outputEffect.targetDataType) {
            const formValue = formValues[outputEffect.id];
            const rawValue = mapByTargetDataTypes[outputEffect.targetDataType]({
                dataElementId,
                trackedEntityAttributeId,
                dataElements,
                trackedEntityAttributes,
            });
            if (rawValue) {
                const { valueType, name } = rawValue;
                const value = onProcessValue(formValue, valueType);

                if (value != null) {
                    return [...acc, { ...outputEffect, hadValue: true, name }];
                }
            }
            return [...acc, outputEffect];
        }
        return [...acc, outputEffect];
    }, []);
