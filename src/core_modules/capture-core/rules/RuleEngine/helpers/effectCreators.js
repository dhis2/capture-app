// @flow
import {
    effectActions,
    rulesEngineEffectTargetDataTypes,
} from '../constants';
import { sanitiseFalsy } from './sanitiseFalsy';
import type {
    ProgramRuleEffect,
    MessageEffect,
    GeneralErrorEffect,
    GeneralWarningEffect,
    ErrorEffects,
    WarningEffects,
    OutputEffect,
    OutputEffects,
} from '../types/ruleEngine.types';


// Effects with targetDataType

const createDataElementEffect = (
    effect: ProgramRuleEffect,
    type: $Values<typeof effectActions>,
): ?OutputEffect =>
    (effect.dataElementId ? ({
        id: effect.dataElementId,
        type,
        targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
    }) : null);

const createTrackedEntityAttributeEffect = (
    effect: ProgramRuleEffect,
    type: $Values<typeof effectActions>,
): ?OutputEffect =>
    (effect.trackedEntityAttributeId ? ({
        id: effect.trackedEntityAttributeId,
        type,
        targetDataType: rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE,
    }) : null);


const effectForConfiguredDataTypeCreators = [
    createDataElementEffect,
    createTrackedEntityAttributeEffect,
];

export const createEffectsForConfiguredDataTypes = (
    effect: ProgramRuleEffect,
    type: $Values<typeof effectActions>,
): OutputEffects =>
    effectForConfiguredDataTypeCreators
        .map(creator => creator(effect, type))
        .filter(Boolean);


// Errors & Warnings

const createGeneralWarningEffect = (
    id: string,
    type: $Values<typeof effectActions>,
    message: string,
): Array<GeneralWarningEffect> => [{
    id: 'general',
    type,
    warning: { id, message },
}];

const createGeneralErrorEffect = (
    id: string,
    type: $Values<typeof effectActions>,
    message: string,
): Array<GeneralErrorEffect> => [{
    id: 'general',
    type,
    error: { id, message },
}];

const createMessageEffects = (
    effects: OutputEffects,
    message: string,
): Array<MessageEffect> =>
    effects.map(effect => ({
        id: effect.id,
        type: effect.type,
        message,
    }));

export const createWarningEffect = (
    effect: ProgramRuleEffect,
    type: $Values<typeof effectActions>,
): WarningEffects => {
    const message = `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`;
    const result = createEffectsForConfiguredDataTypes(effect, type);
    return (result.length !== 0) ?
        createMessageEffects(result, message) :
        createGeneralWarningEffect(effect.id, type, message);
};

export const createErrorEffect = (
    effect: ProgramRuleEffect,
    type: $Values<typeof effectActions>,
): ErrorEffects => {
    const message = `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`;
    const result = createEffectsForConfiguredDataTypes(effect, type);
    return (result.length !== 0) ?
        createMessageEffects(result, message) :
        createGeneralErrorEffect(effect.id, type, message);
};
