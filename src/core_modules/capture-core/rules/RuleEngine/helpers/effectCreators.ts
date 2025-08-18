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

const createDataElementEffect = (
    effect: ProgramRuleEffect,
    type: typeof effectActions[keyof typeof effectActions],
): OutputEffect | null =>
    (effect.dataElementId ? ({
        id: effect.dataElementId,
        type,
        targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
    }) : null);

const createTrackedEntityAttributeEffect = (
    effect: ProgramRuleEffect,
    type: typeof effectActions[keyof typeof effectActions],
): OutputEffect | null =>
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
    type: typeof effectActions[keyof typeof effectActions],
): OutputEffects =>
    effectForConfiguredDataTypeCreators
        .map(creator => creator(effect, type))
        .filter((outputEffect): outputEffect is OutputEffect => outputEffect !== null);

const createGeneralWarningEffect = (
    id: string,
    type: typeof effectActions[keyof typeof effectActions],
    message: string,
): Array<GeneralWarningEffect> => [{
    id: 'general',
    type,
    warning: { id, message },
}];

const createGeneralErrorEffect = (
    id: string,
    type: typeof effectActions[keyof typeof effectActions],
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
        targetDataType: effect.targetDataType,
        message,
    }));

export const createWarningEffect = (
    effect: ProgramRuleEffect,
    type: typeof effectActions[keyof typeof effectActions],
): WarningEffects => {
    const message = `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`;
    const result = createEffectsForConfiguredDataTypes(effect, type);
    return (result.length !== 0) ?
        createMessageEffects(result, message) :
        createGeneralWarningEffect(effect.id, type, message);
};

export const createErrorEffect = (
    effect: ProgramRuleEffect,
    type: typeof effectActions[keyof typeof effectActions],
): ErrorEffects => {
    const message = `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`;
    const result = createEffectsForConfiguredDataTypes(effect, type);
    return (result.length !== 0) ?
        createMessageEffects(result, message) :
        createGeneralErrorEffect(effect.id, type, message);
};
