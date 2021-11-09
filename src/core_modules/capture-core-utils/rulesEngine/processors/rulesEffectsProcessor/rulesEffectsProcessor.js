// @flow
import { mapTypeToInterfaceFnName, effectActions, idNames, rulesEngineEffectTargetDataTypes } from '../../constants';

import type {
    ProgramRuleEffect,
    DataElement,
    DataElements,
    TrackedEntityAttribute,
    TrackedEntityAttributes,
    IConvertOutputRulesEffectsValue,
    AssignOutputEffect,
    HideOutputEffect,
    MessageEffect,
    GeneralErrorEffect,
    GeneralWarningEffect,
    CompulsoryEffect,
    OutputEffects,
} from '../../rulesEngine.types';
import { normalizeRuleVariable } from '../../commonUtils/normalizeRuleVariable';

const sanitiseFalsy = (value) => {
    if (value) {
        return value;
    }
    if (value === 0) {
        return 0;
    }
    return '';
};

type BaseValueType = number | ?string | boolean;
type WarningEffect = Array<MessageEffect> | GeneralWarningEffect;
type ErrorEffect = Array<MessageEffect> | GeneralErrorEffect;

export function getRulesEffectsProcessor(
    outputConverters: IConvertOutputRulesEffectsValue,
) {
    const idNamesArray = [idNames.DATA_ELEMENT_ID, idNames.TRACKED_ENTITY_ATTRIBUTE_ID];

    function createEffectsWithExistingIds(
        effect: ProgramRuleEffect,
        getOutputEffect: () => any): any {
        return idNamesArray
            .filter(idName => effect[idName])
            .map((idName) => {
                const outputEffect = getOutputEffect();
                outputEffect.id = effect[idName];
                outputEffect.targetDataType = idName === idNames.DATA_ELEMENT_ID ?
                    rulesEngineEffectTargetDataTypes.DATA_ELEMENT :
                    rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE;
                return outputEffect;
            });
    }

    function createErrorDetectionEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): any {
        const result = createEffectsWithExistingIds(effect, (): any => ({
            type,
            message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        }));
        return result.length !== 0 ? result : {
            type,
            id: 'general',
        };
    }

    function createWarningEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): WarningEffect {
        const result = createErrorDetectionEffect(effect, type);
        if (Array.isArray(result)) {
            return result;
        }
        result.warning = {
            id: effect.id,
            message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        };
        return result;
    }

    function createErrorEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): ErrorEffect {
        const result = createErrorDetectionEffect(effect, type);
        if (Array.isArray(result)) {
            return result;
        }
        result.error = {
            id: effect.id,
            message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        };
        return result;
    }

    function convertNormalizedValueToOutputValue(normalizedValue: BaseValueType, valueType: string) {
        let outputValue;
        if (normalizedValue || normalizedValue === 0 || normalizedValue === false) {
            const converterName: string = mapTypeToInterfaceFnName[valueType];
            // $FlowExpectedError
            outputValue = outputConverters[converterName](normalizedValue);
        } else {
            outputValue = normalizedValue;
        }
        return outputValue;
    }

    function createAssignValueEffect(
        effect: ProgramRuleEffect,
        element: DataElement | TrackedEntityAttribute): AssignOutputEffect {
        const normalizedValue = normalizeRuleVariable(effect.data, element.valueType);
        const outputValue = convertNormalizedValueToOutputValue(normalizedValue, element.valueType);

        return {
            type: effectActions.ASSIGN_VALUE,
            id: element.id,
            value: outputValue,
        };
    }

    function processAssignValue(
        effect: ProgramRuleEffect,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes): Array<AssignOutputEffect> {
        const effects = [];
        if (dataElements && effect.dataElementId && dataElements[effect.dataElementId]) {
            effects.push(createAssignValueEffect(effect, dataElements[effect.dataElementId]));
        }
        if (trackedEntityAttributes && effect.trackedEntityAttributeId && trackedEntityAttributes[effect.trackedEntityAttributeId]) {
            effects.push(createAssignValueEffect(effect, trackedEntityAttributes[effect.trackedEntityAttributeId]));
        }
        return effects;
    }

    function processHideField(effect: ProgramRuleEffect): Array<HideOutputEffect> {
        return createEffectsWithExistingIds(effect, () => ({
            type: effectActions.HIDE_FIELD,
        }));
    }

    function processShowError(effect: ProgramRuleEffect): ErrorEffect {
        return createErrorEffect(effect, effectActions.SHOW_ERROR);
    }

    function processShowWarning(effect: ProgramRuleEffect): WarningEffect {
        return createWarningEffect(effect, effectActions.SHOW_WARNING);
    }

    function processShowErrorOnComplete(effect: ProgramRuleEffect): ErrorEffect {
        return createErrorEffect(effect, effectActions.SHOW_ERROR_ONCOMPLETE);
    }

    function processShowWarningOnComplete(effect: ProgramRuleEffect): WarningEffect {
        return createWarningEffect(effect, effectActions.SHOW_WARNING_ONCOMPLETE);
    }

    function processHideSection(effect: ProgramRuleEffect): ?HideOutputEffect {
        if (!effect.programStageSectionId) {
            return null;
        }

        return {
            type: effectActions.HIDE_SECTION,
            id: effect.programStageSectionId,
        };
    }

    function processMakeCompulsory(effect: ProgramRuleEffect): Array<CompulsoryEffect> {
        return createEffectsWithExistingIds(effect, () => ({
            type: effectActions.MAKE_COMPULSORY,
        }));
    }

    function processDisplayText(effect: ProgramRuleEffect): any {
        return {
            type: effectActions.DISPLAY_TEXT,
            id: effect.location,
            displayText: {
                id: effect.id,
                message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
                ...effect.style,
            },
        };
    }

    function processDisplayKeyValuePair(effect: ProgramRuleEffect): any {
        return {
            type: effectActions.DISPLAY_KEY_VALUE_PAIR,
            id: effect.location,
            displayKeyValuePair: {
                id: effect.id,
                key: effect.content,
                value: effect.data,
                ...effect.style,
            },
        };
    }

    function processHideOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsWithExistingIds(effect, () => ({
            type: effectActions.HIDE_OPTION_GROUP,
            optionGroupId: effect.optionGroupId,
        }));
    }

    function processHideOption(effect: ProgramRuleEffect): any {
        return createEffectsWithExistingIds(effect, () => ({
            type: effectActions.HIDE_OPTION,
            optionId: effect.optionId,
        }));
    }

    function processShowOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsWithExistingIds(effect, () => ({
            type: effectActions.SHOW_OPTION_GROUP,
            optionGroupId: effect.optionGroupId,
        }));
    }

    const mapActionsToProcessor = {
        [effectActions.ASSIGN_VALUE]: processAssignValue,
        [effectActions.HIDE_FIELD]: processHideField,
        [effectActions.SHOW_ERROR]: processShowError,
        [effectActions.SHOW_WARNING]: processShowWarning,
        [effectActions.SHOW_ERROR_ONCOMPLETE]: processShowErrorOnComplete,
        [effectActions.SHOW_WARNING_ONCOMPLETE]: processShowWarningOnComplete,
        [effectActions.HIDE_SECTION]: processHideSection,
        [effectActions.MAKE_COMPULSORY]: processMakeCompulsory,
        [effectActions.DISPLAY_TEXT]: processDisplayText,
        [effectActions.DISPLAY_KEY_VALUE_PAIR]: processDisplayKeyValuePair,
        [effectActions.HIDE_OPTION_GROUP]: processHideOptionGroup,
        [effectActions.HIDE_OPTION]: processHideOption,
        [effectActions.SHOW_OPTION_GROUP]: processShowOptionGroup,
    };

    function processRulesEffects(
        effects: ?Array<ProgramRuleEffect>,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes): OutputEffects {
        if (effects) {
            return effects
                .filter(({ action }) => mapActionsToProcessor[action])
                .flatMap(effect => mapActionsToProcessor[effect.action](
                    effect,
                    dataElements,
                    trackedEntityAttributes,
                ))
            // when mapActionsToProcessor function returns `null` we filter those value out.
                .filter(keepTruthyValues => keepTruthyValues);
        }
        return [];
    }

    return processRulesEffects;
}
