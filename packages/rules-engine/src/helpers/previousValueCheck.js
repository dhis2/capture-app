// @flow
import { rulesEngineEffectTargetDataTypes, typeKeys } from '../constants';
import type { DataElements, TrackedEntityAttributes, HideOutputEffect } from '../rulesEngine.types';

const processDataElementValue = ({
    dataElementId,
    dataElements,
}: {
    dataElementId: ?string,
    dataElements: ?DataElements,
}) => {
    if (dataElementId && dataElements && dataElements[dataElementId]) {
        const dataElement = dataElements[dataElementId];
        return {
            valueName: dataElement.name,
            valueType: dataElement.optionSetId ? typeKeys.TEXT : dataElement.valueType,
        };
    }

    return {
        valueName: '',
        valueType: typeKeys.TEXT,
    };
};

const processTEAValue = ({
    trackedEntityAttributeId,
    trackedEntityAttributes,
}: {
    trackedEntityAttributeId: ?string,
    trackedEntityAttributes: ?TrackedEntityAttributes,
}) => {
    if (trackedEntityAttributeId && trackedEntityAttributes && trackedEntityAttributes[trackedEntityAttributeId]) {
        const attribute = trackedEntityAttributes[trackedEntityAttributeId];
        return {
            valueName: attribute.displayFormName || attribute.displayName,
            valueType: attribute.optionSetId ? typeKeys.TEXT : attribute.valueType,
        };
    }

    return {
        valueName: '',
        valueType: typeKeys.TEXT,
    };
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
    outputEffects: Array<HideOutputEffect>,
    dataElementId: ?string,
    trackedEntityAttributeId: ?string,
    dataElements: ?DataElements,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    formValues?: ?{ [key: string]: any },
    onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any,
}) =>
    outputEffects.reduce((acc, outputEffect) => {
        if (formValues && outputEffect.targetDataType) {
            const rawValue = formValues[outputEffect.id];
            const { valueType, valueName } = mapByTargetDataTypes[outputEffect.targetDataType]({
                dataElementId,
                trackedEntityAttributeId,
                dataElements,
                trackedEntityAttributes,
            });
            const value = onProcessValue(rawValue, valueType);
            if (value) {
                return [...acc, { ...outputEffect, hadValue: true, name: valueName }];
            }
            return [...acc, outputEffect];
        }
        return [...acc, outputEffect];
    }, []);
