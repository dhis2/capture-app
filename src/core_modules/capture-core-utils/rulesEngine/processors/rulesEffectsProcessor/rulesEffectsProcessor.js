// @flow
import { mapTypeToInterfaceFnName } from '../../typeToInterfaceFnName.const';
import { effectActions } from '../../effectActions.const';

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
    OutputEffect,
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
    const idNames = ['dataElementId', 'trackedEntityAttributeId'];

    function applyToExistingIds(
        effect: ProgramRuleEffect,
        processor: (string) => ?any): any {
        return idNames
            .filter(idName => effect[idName])
            .map(processor);
    }

    function createWarningEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): WarningEffect {
        return applyToExistingIds(effect, (idName: string): MessageEffect => ({
            type,
            id: effect[idName],
            message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        })) ||
        {
            type,
            id: 'general',
            warning: {
                id: effect.id,
                message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
            },
        };
    }

    function createErrorEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): ErrorEffect {
        return applyToExistingIds(effect, (idName: string): MessageEffect => ({
            type,
            id: effect[idName],
            message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        })) ||
        {
            type,
            id: 'general',
            error: {
                id: effect.id,
                message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
            },
        };
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
        return applyToExistingIds(effect, (idName: string): HideOutputEffect => ({
            type: effectActions.HIDE_FIELD,
            id: effect[idName],
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
        // Why must processType be of type EVENT?
        // if (processType !== processTypes.EVENT || !effect.programStageSectionId) {
        if (!effect.programStageSectionId) {
            return null;
        }

        return {
            type: effectActions.HIDE_SECTION,
            id: effect.programStageSectionId,
        };
    }

    function processMakeCompulsory(effect: ProgramRuleEffect): ?Array<CompulsoryEffect> {
        return applyToExistingIds(effect, (idName: string): CompulsoryEffect => ({
            type: effectActions.MAKE_COMPULSORY,
            id: effect[idName],
        }));
    }

    function processDisplayText(effect: ProgramRuleEffect): ?any {
        return {
            type: effectActions.DISPLAY_TEXT,
            id: effect.location,
            displayText: {
                id: effect.id,
                message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
            },
        };
    }

    function processDisplayKeyValuePair(effect: ProgramRuleEffect): ?any {
        return {
            type: effectActions.DISPLAY_KEY_VALUE_PAIR,
            id: effect.location,
            displayKeyValuePair: {
                id: effect.id,
                key: effect.content,
                value: effect.data,
            },
        };
    }

    function processHideOptionGroup(effect: ProgramRuleEffect): ?any {
        return applyToExistingIds(effect, (idName: string) => ({
            type: effectActions.HIDE_OPTION_GROUP,
            id: effect[idName],
            optionGroupId: effect.optionGroupId,
        }));
    }

    function processHideOption(effect: ProgramRuleEffect): ?any {
        return applyToExistingIds(effect, (idName: string) => ({
            type: effectActions.HIDE_OPTION,
            id: effect[idName],
            optionId: effect.optionId,
        }));
    }

    function processShowOptionGroup(effect: ProgramRuleEffect): ?any {
        return applyToExistingIds(effect, (idName: string) => ({
            type: effectActions.SHOW_OPTION_GROUP,
            id: effect[idName],
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
        trackedEntityAttributes: ?TrackedEntityAttributes): ?Array<OutputEffect> {
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
        return null;
    }

    return processRulesEffects;
}
