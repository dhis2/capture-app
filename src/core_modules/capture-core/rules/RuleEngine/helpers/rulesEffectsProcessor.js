// @flow
import log from 'loglevel';
import {
    attributeTypes,
    effectActions,
    mapTypeToInterfaceFnName,
    rulesEngineEffectTargetDataTypes,
    typeKeys,
} from '../constants';
import type {
    ProgramRuleEffect,
    DataElement,
    DataElements,
    TrackedEntityAttribute,
    TrackedEntityAttributes,
    IConvertOutputRulesEffectsValue,
    AssignOutputEffect,
    HideOutputEffect,
    HideProgramStageEffect,
    ErrorEffects,
    WarningEffects,
    CompulsoryEffect,
    OutputEffects,
} from '../types/ruleEngine.types';
import { normalizeRuleVariable } from './normalizeRuleVariable';
import { sanitiseFalsy } from './sanitiseFalsy';
import { getOutputEffectsWithPreviousValueCheck } from './previousValueCheck';
import {
    createEffectsForConfiguredDataTypes,
    createWarningEffect,
    createErrorEffect,
} from './effectCreators';

type BaseValueType = number | ?string | boolean;

const errorCreator = (message: string) => (details?: ?Object) => ({
    ...details,
    message,
});

const numberToString = (number: number): string =>
    (isNaN(number) || number === Infinity ? '' : String(number));

export function getRulesEffectsProcessor(
    outputConverters: IConvertOutputRulesEffectsValue,
) {
    function convertNormalizedValueToOutputValue(normalizedValue: BaseValueType, valueType: string) {
        let outputValue;
        if (normalizedValue || normalizedValue === 0 || normalizedValue === false) {
            const converterName: string = mapTypeToInterfaceFnName[valueType];
            // $FlowExpectedError
            const outputConverter = outputConverters[converterName];
            if (!converterName || !outputConverter) {
                log.warn(errorCreator('converter for valueType is missing')({ valueType }));
                return '';
            }
            outputValue = outputConverter(normalizedValue);
        } else {
            outputValue = normalizedValue;
        }
        return outputValue;
    }

    function createAssignValueEffect(
        data: any,
        element: DataElement | TrackedEntityAttribute,
        targetDataType: $Values<typeof rulesEngineEffectTargetDataTypes>,
    ): AssignOutputEffect {
        const normalizedValue = normalizeRuleVariable(data, element.valueType);
        const outputValue = convertNormalizedValueToOutputValue(normalizedValue, element.valueType);

        return {
            type: effectActions.ASSIGN_VALUE,
            id: element.id,
            value: outputValue,
            targetDataType,
        };
    }

    function processAssignValue(
        effect: ProgramRuleEffect,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
    ): Array<AssignOutputEffect> {
        if (effect.attributeType === attributeTypes.DATA_ELEMENT) {
            if (dataElements?.[effect.field]) {
                return [createAssignValueEffect(
                    effect.data,
                    dataElements[effect.field],
                    rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                )];
            }
        } else if (effect.attributeType === attributeTypes.TRACKED_ENTITY_ATTRIBUTE) {
            if (trackedEntityAttributes?.[effect.field]) {
                return [createAssignValueEffect(
                    effect.data,
                    trackedEntityAttributes[effect.field],
                    rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE,
                )];
            }
        }
        return [];
    }

    function processHideField(
        effect: ProgramRuleEffect,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        formValues?: ?{[key: string]: any},
        onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any,
    ): Array<HideOutputEffect> {
        const outputEffects = createEffectsForConfiguredDataTypes(
            effect,
            effectActions.HIDE_FIELD,
        ).map(outputEffect => ({
            ...outputEffect,
            ...(effect.content ? { content: effect.content } : {}),
        }));
        return getOutputEffectsWithPreviousValueCheck({
            outputEffects,
            formValues,
            dataElementId: effect.dataElementId,
            trackedEntityAttributeId: effect.trackedEntityAttributeId,
            dataElements,
            trackedEntityAttributes,
            onProcessValue,
        });
    }

    function processShowError(effect: ProgramRuleEffect): ErrorEffects {
        return createErrorEffect(effect, effectActions.SHOW_ERROR);
    }

    function processShowWarning(effect: ProgramRuleEffect): WarningEffects {
        return createWarningEffect(effect, effectActions.SHOW_WARNING);
    }

    function processShowErrorOnComplete(effect: ProgramRuleEffect): ErrorEffects {
        return createErrorEffect(effect, effectActions.SHOW_ERROR_ONCOMPLETE);
    }

    function processShowWarningOnComplete(effect: ProgramRuleEffect): WarningEffects {
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

    function processHideProgramStage(effect: ProgramRuleEffect): ?HideProgramStageEffect {
        if (!effect.programStageId) {
            return null;
        }

        return {
            type: effectActions.HIDE_PROGRAM_STAGE,
            id: effect.programStageId,
        };
    }

    function processMakeCompulsory(effect: ProgramRuleEffect): Array<CompulsoryEffect> {
        return createEffectsForConfiguredDataTypes(effect, effectActions.MAKE_COMPULSORY);
    }

    function processDisplayText(effect: ProgramRuleEffect): any {
        const message = effect.displayContent || '';
        return {
            type: effectActions.DISPLAY_TEXT,
            id: effect.location,
            displayText: {
                id: effect.id,
                message: `${message} ${sanitiseFalsy(effect.data)}`,
                ...effect.style,
            },
        };
    }

    function processDisplayKeyValuePair(effect: ProgramRuleEffect): any {
        const data = effect.data !== undefined ? effect.data : '';

        return {
            type: effectActions.DISPLAY_KEY_VALUE_PAIR,
            id: effect.location,
            displayKeyValuePair: {
                id: effect.id,
                key: effect.displayContent,
                value: typeof data === 'number' ? numberToString(data) : String(data),
                ...effect.style,
            },
        };
    }

    function processHideOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, effectActions.HIDE_OPTION_GROUP)
            .map(outputEffect => ({
                ...outputEffect,
                optionGroupId: effect.optionGroupId,
            }));
    }

    function processHideOption(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, effectActions.HIDE_OPTION)
            .map(outputEffect => ({
                ...outputEffect,
                optionId: effect.optionId,
            }));
    }

    function processShowOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, effectActions.SHOW_OPTION_GROUP)
            .map(outputEffect => ({
                ...outputEffect,
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
        [effectActions.HIDE_PROGRAM_STAGE]: processHideProgramStage,
        [effectActions.HIDE_SECTION]: processHideSection,
        [effectActions.MAKE_COMPULSORY]: processMakeCompulsory,
        [effectActions.DISPLAY_TEXT]: processDisplayText,
        [effectActions.DISPLAY_KEY_VALUE_PAIR]: processDisplayKeyValuePair,
        [effectActions.HIDE_OPTION_GROUP]: processHideOptionGroup,
        [effectActions.HIDE_OPTION]: processHideOption,
        [effectActions.SHOW_OPTION_GROUP]: processShowOptionGroup,
    };

    function processRulesEffects({
        effects,
        dataElements,
        trackedEntityAttributes,
        formValues,
        onProcessValue,
    }: {
        effects: Array<ProgramRuleEffect>,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        formValues?: ?{ [key: string]: any },
        onProcessValue: (value: any, type: $Values<typeof typeKeys>) => any,
    }): OutputEffects {
        return effects
            .filter(({ action }) => mapActionsToProcessor[action])
            .flatMap(effect => mapActionsToProcessor[effect.action](
                effect,
                dataElements,
                trackedEntityAttributes,
                formValues,
                onProcessValue,
            ))
        // when mapActionsToProcessor function returns `null` we filter those values out.
            .filter(Boolean);
    }

    return processRulesEffects;
}
