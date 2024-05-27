// @flow
import log from 'loglevel';
import { errorCreator } from '../../errorCreator';
import { mapTypeToInterfaceFnName, effectActions, idNames, rulesEngineEffectTargetDataTypes, typeKeys } from '../../constants';

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
    MessageEffect,
    GeneralErrorEffect,
    GeneralWarningEffect,
    CompulsoryEffect,
    OutputEffects,
} from '../../rulesEngine.types';
import { normalizeRuleVariable, numberToString } from '../../commonUtils';
import { getOutputEffectsWithPreviousValueCheck } from '../../helpers';

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

    function createEffectsForConfiguredDataTypes(
        effect: ProgramRuleEffect,
        getOutputEffect: () => any,
    ): any {
        return idNamesArray
            .filter(idName => effect[idName])
            .map((idName) => {
                const outputEffect = getOutputEffect();
                outputEffect.id = effect[idName];
                outputEffect.targetDataType =
                    idName === idNames.DATA_ELEMENT_ID
                        ? rulesEngineEffectTargetDataTypes.DATA_ELEMENT
                        : rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE;
                return outputEffect;
            });
    }

    function createErrorDetectionEffect(
        effect: ProgramRuleEffect,
        type: $Values<typeof effectActions>): any {
        const result = createEffectsForConfiguredDataTypes(effect, (): any => ({
            type,
            message: `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`,
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
            message: `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`,
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
            message: `${effect.displayContent || ''} ${sanitiseFalsy(effect.data)}`,
        };
        return result;
    }

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
        effect: ProgramRuleEffect,
        element: DataElement | TrackedEntityAttribute,
        targetDataType: $Values<typeof rulesEngineEffectTargetDataTypes>,
    ): AssignOutputEffect {
        const normalizedValue = normalizeRuleVariable(effect.data, element.valueType);
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
        trackedEntityAttributes: ?TrackedEntityAttributes): Array<AssignOutputEffect> {
        const effects = [];
        if (dataElements && effect.dataElementId && dataElements[effect.dataElementId]) {
            effects.push(createAssignValueEffect(
                effect,
                dataElements[effect.dataElementId],
                rulesEngineEffectTargetDataTypes.DATA_ELEMENT),
            );
        }
        if (trackedEntityAttributes &&
            effect.trackedEntityAttributeId &&
            trackedEntityAttributes[effect.trackedEntityAttributeId]) {
            effects.push(createAssignValueEffect(
                effect,
                trackedEntityAttributes[effect.trackedEntityAttributeId],
                rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE),
            );
        }
        return effects;
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
            () => ({
                type: effectActions.HIDE_FIELD,
                content: effect.content,
            }),
        );
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
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.MAKE_COMPULSORY,
        }));
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
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.HIDE_OPTION_GROUP,
            optionGroupId: effect.optionGroupId,
        }));
    }

    function processHideOption(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.HIDE_OPTION,
            optionId: effect.optionId,
        }));
    }

    function processShowOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, () => ({
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
        // when mapActionsToProcessor function returns `null` we filter those value out.
            .filter(keepTruthyValues => keepTruthyValues);
    }

    return processRulesEffects;
}
