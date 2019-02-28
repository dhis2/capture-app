// @flow
import mapTypeToInterfaceFnName from '../typeToInterfaceFnName.const';
import processTypes from './processTypes.const';
import actions from '../effectActions.const';

import type {
    ProgramRuleEffect,
    DataElements,
    TrackedEntityAttributes,
    IConvertOutputRulesEffectsValue,
    AssignOutputEffect,
    HideOutputEffect,
    MessageEffect,
    GeneralErrorEffect,
    GeneralWarningEffect,
    CompulsoryEffect,
} from '../rulesEngine.types';

const mapProcessTypeToIdentifierName = {
    [processTypes.EVENT]: 'dataElementId',
    [processTypes.TEI]: 'trackedEntityAttributeId',
};

type ConvertDataToBaseOutputValue = (value: any, valueType: string) => any;

export default function getRulesEffectsProcessor(
    onConvertDataToBaseOutputValue: ConvertDataToBaseOutputValue,
    rulesEffectsValueConverters: IConvertOutputRulesEffectsValue,
) {
    function convertBaseValueToOutputValue(baseValue: any, valueType: string) {
        let outputValue;
        if (baseValue || baseValue === 0 || baseValue === false) {
            const converterName = mapTypeToInterfaceFnName[valueType];
            // $FlowSuppress
            outputValue = rulesEffectsValueConverters[converterName] ?
                // $FlowSuppress
                rulesEffectsValueConverters[converterName](baseValue) :
                baseValue;
        } else {
            outputValue = baseValue;
        }
        return outputValue;
    }

    function processAssignValue(
        effect: ProgramRuleEffect,
        processIdName: string,
        processType: $Values<typeof processTypes>,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes): ?AssignOutputEffect {
        if (!effect[processIdName]) {
            return null;
        }
        const element = processType === processTypes.EVENT ?
            // $FlowSuppress
            dataElements[effect[processIdName]] :
            // $FlowSuppress
            trackedEntityAttributes[effect[processIdName]];

        const valueType = element.valueType;
        const baseValue = onConvertDataToBaseOutputValue(effect.data, valueType);
        const outputValue = convertBaseValueToOutputValue(baseValue, valueType);

        return {
            type: actions.ASSIGN_VALUE,
            id: effect[processIdName],
            value: outputValue,
        };
    }

    function processHideField(effect: ProgramRuleEffect, processIdName: string): ?HideOutputEffect {
        if (!effect[processIdName]) {
            return null;
        }

        return {
            type: actions.HIDE_FIELD,
            id: effect[processIdName],
        };
    }

    function processShowError(effect: ProgramRuleEffect, processIdName: string): ?(MessageEffect | GeneralErrorEffect) {
        if (!effect[processIdName]) {
            return {
                type: actions.SHOW_ERROR,
                id: 'generalErrors',
                error: {
                    id: effect.id,
                    message: `${effect.content} ${effect.data ? effect.data : ''}`,
                },
            };
        }

        return {
            type: actions.SHOW_ERROR,
            id: effect[processIdName],
            message: `${effect.content} ${effect.data ? effect.data : ''}`,
        };
    }

    function processShowWarning(effect: ProgramRuleEffect, processIdName: string): ?(MessageEffect | GeneralWarningEffect) {
        if (!effect[processIdName]) {
            return {
                type: actions.SHOW_WARNING,
                id: 'generalWarnings',
                warning: { id: effect.id, message: `${effect.content} ${effect.data ? effect.data : ''}` },
            };
        }

        return {
            type: actions.SHOW_WARNING,
            id: effect[processIdName],
            message: `${effect.content} ${effect.data ? effect.data : ''}`,
        };
    }

    function processShowErrorOnComplete(effect: ProgramRuleEffect, processIdName: string): ?MessageEffect {
        if (!effect[processIdName]) {
            return null;
        }

        return {
            type: actions.SHOW_ERROR_ONCOMPLETE,
            id: effect[processIdName],
            message: `${effect.content} ${effect.data ? effect.data : ''}`,
        };
    }

    function processShowWarningOnComplete(effect: ProgramRuleEffect, processIdName: string): ?MessageEffect {
        if (!effect[processIdName]) {
            return null;
        }

        return {
            type: actions.SHOW_WARNING_ONCOMPLETE,
            id: effect[processIdName],
            message: `${effect.content} ${effect.data ? effect.data : ''}`,
        };
    }

    function processHideSection(
        effect: ProgramRuleEffect,
        processIdName: string,
        processType: $Values<typeof processTypes>): ?HideOutputEffect {
        if (processType !== processTypes.EVENT || !effect.programStageSectionId) {
            return null;
        }

        return {
            type: actions.HIDE_SECTION,
            id: effect.programStageSectionId,
        };
    }

    function processMakeCompulsory(effect: ProgramRuleEffect, processIdName: string): ?CompulsoryEffect {
        if (!effect[processIdName]) {
            return null;
        }

        return {
            type: actions.MAKE_COMPULSORY,
            id: effect[processIdName],
        };
    }

    function processDisplayText(effect: ProgramRuleEffect): ?any {
        return {
            type: actions.DISPLAY_TEXT,
            id: effect.location,
            displayText: {
                id: effect.id,
                message: `${effect.content} ${effect.data ? effect.data : ''}`,
            },
        };
    }

    function processDisplayKeyValuePair(effect: ProgramRuleEffect): ?any {
        return {
            type: actions.DISPLAY_KEY_VALUE_PAIR,
            id: effect.location,
            displayKeyValuePair: {
                id: effect.id,
                key: effect.content,
                value: effect.data,
            },
        };
    }

    const mapActionsToProcessor = {
        [actions.ASSIGN_VALUE]: processAssignValue,
        [actions.HIDE_FIELD]: processHideField,
        [actions.SHOW_ERROR]: processShowError,
        [actions.SHOW_WARNING]: processShowWarning,
        [actions.SHOW_ERROR_ONCOMPLETE]: processShowErrorOnComplete,
        [actions.SHOW_WARNING_ONCOMPLETE]: processShowWarningOnComplete,
        [actions.HIDE_SECTION]: processHideSection,
        [actions.MAKE_COMPULSORY]: processMakeCompulsory,
        [actions.DISPLAY_TEXT]: processDisplayText,
        [actions.DISPLAY_KEY_VALUE_PAIR]: processDisplayKeyValuePair,
    };

    function processRulesEffects(
        effects: Array<ProgramRuleEffect>,
        processType: $Values<typeof processTypes>,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes) {
        const processIdName = mapProcessTypeToIdentifierName[processType];

        return effects
            .map((effect) => {
                const action = effect.action;
                return mapActionsToProcessor[action] ?
                    mapActionsToProcessor[action](
                        effect,
                        processIdName,
                        processType,
                        dataElements,
                        trackedEntityAttributes,
                    ) : null;
            })
            .filter(effect => effect);
    }

    return processRulesEffects;
}
