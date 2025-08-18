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

type BaseValueType = number | string | null | boolean;
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
        type: keyof typeof effectActions): any {
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
        type: keyof typeof effectActions): WarningEffect {
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
        type: keyof typeof effectActions): ErrorEffect {
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
        targetDataType: keyof typeof rulesEngineEffectTargetDataTypes,
    ): AssignOutputEffect {
        const normalizedValue = normalizeRuleVariable(effect.data, element.valueType);
        const outputValue = convertNormalizedValueToOutputValue(normalizedValue, element.valueType);

        return {
            type: effectActions.ASSIGN_VALUE as any,
            id: element.id,
            value: outputValue,
            targetDataType,
        };
    }

    function processAssignValue(
        effect: ProgramRuleEffect,
        dataElements: DataElements | null,
        trackedEntityAttributes: TrackedEntityAttributes | null): Array<AssignOutputEffect> {
        const effects: AssignOutputEffect[] = [];
        if (dataElements && effect.dataElementId && dataElements[effect.dataElementId]) {
            effects.push(createAssignValueEffect(
                effect,
                dataElements[effect.dataElementId],
                'DATA_ELEMENT' as keyof typeof rulesEngineEffectTargetDataTypes),
            );
        }
        if (trackedEntityAttributes &&
            effect.trackedEntityAttributeId &&
            trackedEntityAttributes[effect.trackedEntityAttributeId]) {
            effects.push(createAssignValueEffect(
                effect,
                trackedEntityAttributes[effect.trackedEntityAttributeId],
                'TRACKED_ENTITY_ATTRIBUTE' as keyof typeof rulesEngineEffectTargetDataTypes),
            );
        }
        return effects;
    }

    function processHideField(
        effect: ProgramRuleEffect,
        dataElements: DataElements | null,
        trackedEntityAttributes: TrackedEntityAttributes | null,
        formValues?: {[key: string]: any} | null,
        onProcessValue?: (value: any, type: keyof typeof typeKeys) => any,
    ): Array<HideOutputEffect> {
        const outputEffects = createEffectsForConfiguredDataTypes(
            effect,
            () => ({
                type: effectActions.HIDE_FIELD as any,
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
        return createErrorEffect(effect, effectActions.SHOW_ERROR as any);
    }

    function processShowWarning(effect: ProgramRuleEffect): WarningEffect {
        return createWarningEffect(effect, effectActions.SHOW_WARNING as any);
    }

    function processShowErrorOnComplete(effect: ProgramRuleEffect): ErrorEffect {
        return createErrorEffect(effect, effectActions.SHOW_ERROR_ONCOMPLETE as any);
    }

    function processShowWarningOnComplete(effect: ProgramRuleEffect): WarningEffect {
        return createWarningEffect(effect, effectActions.SHOW_WARNING_ONCOMPLETE as any);
    }

    function processHideSection(effect: ProgramRuleEffect): HideOutputEffect | null {
        if (!effect.programStageSectionId) {
            return null;
        }

        return {
            type: effectActions.HIDE_SECTION as any,
            id: effect.programStageSectionId,
        };
    }

    function processHideProgramStage(effect: ProgramRuleEffect): HideProgramStageEffect | null {
        if (!effect.programStageId) {
            return null;
        }

        return {
            type: effectActions.HIDE_PROGRAM_STAGE as any,
            id: effect.programStageId,
        };
    }

    function processMakeCompulsory(effect: ProgramRuleEffect): Array<CompulsoryEffect> {
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.MAKE_COMPULSORY as any,
        }));
    }

    function processDisplayText(effect: ProgramRuleEffect): any {
        const message = effect.displayContent || '';
        return {
            type: effectActions.DISPLAY_TEXT as any,
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
            type: effectActions.DISPLAY_KEY_VALUE_PAIR as any,
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
            type: effectActions.HIDE_OPTION_GROUP as any,
            optionGroupId: effect.optionGroupId,
        }));
    }

    function processHideOption(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.HIDE_OPTION as any,
            optionId: effect.optionId,
        }));
    }

    function processShowOptionGroup(effect: ProgramRuleEffect): any {
        return createEffectsForConfiguredDataTypes(effect, () => ({
            type: effectActions.SHOW_OPTION_GROUP as any,
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
        dataElements: DataElements | null,
        trackedEntityAttributes: TrackedEntityAttributes | null,
        formValues?: { [key: string]: any } | null,
        onProcessValue?: (value: any, type: keyof typeof typeKeys) => any,
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
