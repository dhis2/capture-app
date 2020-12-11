// @flow
import mapTypeToInterfaceFnName from '../../typeToInterfaceFnName.const';
import processTypes from './processTypes.const';
import { effectActions } from '../../effectActions.const';

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
  OutputEffect,
} from '../../rulesEngine.types';

const mapProcessTypeToIdentifierName = {
  [processTypes.EVENT]: 'dataElementId',
  [processTypes.TEI]: 'trackedEntityAttributeId',
};

type ConvertDataToBaseOutputValue = (value: any, valueType: string) => any;

const sanitiseFalsy = (value) => {
  if (value) {
    return value;
  }
  if (value === 0) {
    return 0;
  }
  return '';
};

export default function getRulesEffectsProcessor(
  onConvertDataToBaseOutputValue: ConvertDataToBaseOutputValue,
  rulesEffectsValueConverters: IConvertOutputRulesEffectsValue,
) {
  function convertBaseValueToOutputValue(baseValue: any, valueType: string) {
    let outputValue;
    if (baseValue || baseValue === 0 || baseValue === false) {
      const converterName = mapTypeToInterfaceFnName[valueType];

      // $FlowFixMe[prop-missing] automated comment
      outputValue = rulesEffectsValueConverters[converterName]
        ? // $FlowFixMe[incompatible-use] automated comment
          rulesEffectsValueConverters[converterName](baseValue)
        : baseValue;
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
    trackedEntityAttributes: ?TrackedEntityAttributes,
  ): ?AssignOutputEffect {
    if (!effect[processIdName]) {
      return null;
    }
    const element =
      processType === processTypes.EVENT
        ? // $FlowFixMe[incompatible-use] automated comment
          dataElements[effect[processIdName]]
        : // $FlowFixMe[incompatible-use] automated comment
          trackedEntityAttributes[effect[processIdName]];

    const { valueType } = element;
    const baseValue = onConvertDataToBaseOutputValue(effect.data, valueType);
    const outputValue = convertBaseValueToOutputValue(baseValue, valueType);

    return {
      type: effectActions.ASSIGN_VALUE,
      id: effect[processIdName],
      value: outputValue,
    };
  }

  function processHideField(effect: ProgramRuleEffect, processIdName: string): ?HideOutputEffect {
    if (!effect[processIdName]) {
      return null;
    }

    return {
      type: effectActions.HIDE_FIELD,
      id: effect[processIdName],
    };
  }

  function processShowError(
    effect: ProgramRuleEffect,
    processIdName: string,
  ): MessageEffect | GeneralErrorEffect {
    if (!effect[processIdName]) {
      return {
        type: effectActions.SHOW_ERROR,
        id: 'general',
        error: {
          id: effect.id,
          message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        },
      };
    }

    return {
      type: effectActions.SHOW_ERROR,
      id: effect[processIdName],
      message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
    };
  }

  function processShowWarning(
    effect: ProgramRuleEffect,
    processIdName: string,
  ): MessageEffect | GeneralWarningEffect {
    if (!effect[processIdName]) {
      return {
        type: effectActions.SHOW_WARNING,
        id: 'general',
        warning: { id: effect.id, message: `${effect.content} ${sanitiseFalsy(effect.data)}` },
      };
    }

    return {
      type: effectActions.SHOW_WARNING,
      id: effect[processIdName],
      message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
    };
  }

  function processShowErrorOnComplete(
    effect: ProgramRuleEffect,
    processIdName: string,
  ): MessageEffect | GeneralErrorEffect {
    if (!effect[processIdName]) {
      return {
        type: effectActions.SHOW_ERROR_ONCOMPLETE,
        id: 'general',
        error: {
          id: effect.id,
          message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        },
      };
    }

    return {
      type: effectActions.SHOW_ERROR_ONCOMPLETE,
      id: effect[processIdName],
      message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
    };
  }

  function processShowWarningOnComplete(
    effect: ProgramRuleEffect,
    processIdName: string,
  ): MessageEffect | GeneralWarningEffect {
    if (!effect[processIdName]) {
      return {
        type: effectActions.SHOW_WARNING_ONCOMPLETE,
        id: 'general',
        warning: {
          id: effect.id,
          message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
        },
      };
    }

    return {
      type: effectActions.SHOW_WARNING_ONCOMPLETE,
      id: effect[processIdName],
      message: `${effect.content} ${sanitiseFalsy(effect.data)}`,
    };
  }

  function processHideSection(
    effect: ProgramRuleEffect,
    processIdName: string,
    processType: $Values<typeof processTypes>,
  ): ?HideOutputEffect {
    if (processType !== processTypes.EVENT || !effect.programStageSectionId) {
      return null;
    }

    return {
      type: effectActions.HIDE_SECTION,
      id: effect.programStageSectionId,
    };
  }

  function processMakeCompulsory(
    effect: ProgramRuleEffect,
    processIdName: string,
  ): ?CompulsoryEffect {
    if (!effect[processIdName]) {
      return null;
    }

    return {
      type: effectActions.MAKE_COMPULSORY,
      id: effect[processIdName],
    };
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

  function processHideOptionGroup(effect: ProgramRuleEffect, processIdName: string): ?any {
    if (!effect[processIdName]) {
      return null;
    }

    return {
      type: effectActions.HIDE_OPTION_GROUP,
      id: effect[processIdName],
      optionGroupId: effect.optionGroupId,
    };
  }

  function processHideOption(effect: ProgramRuleEffect, processIdName: string): ?any {
    if (!effect[processIdName]) {
      return null;
    }

    return {
      type: effectActions.HIDE_OPTION,
      id: effect[processIdName],
      optionId: effect.optionId,
    };
  }

  function processShowOptionGroup(effect: ProgramRuleEffect, processIdName: string): ?any {
    if (!effect[processIdName]) {
      return null;
    }

    return {
      type: effectActions.SHOW_OPTION_GROUP,
      id: effect[processIdName],
      optionGroupId: effect.optionGroupId,
    };
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
    processType: $Values<typeof processTypes>,
    dataElements: ?DataElements,
    trackedEntityAttributes: ?TrackedEntityAttributes,
  ): ?Array<OutputEffect> {
    const processIdName = mapProcessTypeToIdentifierName[processType];

    if (effects) {
      return (
        effects
          .filter(({ action }) => mapActionsToProcessor[action])
          .map((effect) =>
            mapActionsToProcessor[effect.action](
              effect,
              processIdName,
              processType,
              dataElements,
              trackedEntityAttributes,
            ),
          )
          // when mapActionsToProcessor function returns `null` we filter those value out.
          .filter((keepTruthyValues) => keepTruthyValues)
      );
    }
    return null;
  }

  return processRulesEffects;
}
