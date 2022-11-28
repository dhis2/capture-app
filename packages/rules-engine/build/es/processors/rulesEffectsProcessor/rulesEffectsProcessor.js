import log from 'loglevel';
import { errorCreator } from '../../errorCreator';
import { mapTypeToInterfaceFnName, effectActions, idNames, rulesEngineEffectTargetDataTypes } from '../../constants';
import { normalizeRuleVariable, numberToString } from '../../commonUtils';

const sanitiseFalsy = value => {
  if (value) {
    return value;
  }

  if (value === 0) {
    return 0;
  }

  return '';
};

export function getRulesEffectsProcessor(outputConverters) {
  const idNamesArray = [idNames.DATA_ELEMENT_ID, idNames.TRACKED_ENTITY_ATTRIBUTE_ID];

  function createEffectsForConfiguredDataTypes(effect, getOutputEffect) {
    return idNamesArray.filter(idName => effect[idName]).map(idName => {
      const outputEffect = getOutputEffect();
      outputEffect.id = effect[idName];
      outputEffect.targetDataType = idName === idNames.DATA_ELEMENT_ID ? rulesEngineEffectTargetDataTypes.DATA_ELEMENT : rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE;
      return outputEffect;
    });
  }

  function createErrorDetectionEffect(effect, type) {
    const result = createEffectsForConfiguredDataTypes(effect, () => ({
      type,
      message: "".concat(effect.displayContent || '', " ").concat(sanitiseFalsy(effect.data))
    }));
    return result.length !== 0 ? result : {
      type,
      id: 'general'
    };
  }

  function createWarningEffect(effect, type) {
    const result = createErrorDetectionEffect(effect, type);

    if (Array.isArray(result)) {
      return result;
    }

    result.warning = {
      id: effect.id,
      message: "".concat(effect.displayContent || '', " ").concat(sanitiseFalsy(effect.data))
    };
    return result;
  }

  function createErrorEffect(effect, type) {
    const result = createErrorDetectionEffect(effect, type);

    if (Array.isArray(result)) {
      return result;
    }

    result.error = {
      id: effect.id,
      message: "".concat(effect.displayContent || '', " ").concat(sanitiseFalsy(effect.data))
    };
    return result;
  }

  function convertNormalizedValueToOutputValue(normalizedValue, valueType) {
    let outputValue;

    if (normalizedValue || normalizedValue === 0 || normalizedValue === false) {
      const converterName = mapTypeToInterfaceFnName[valueType]; // $FlowExpectedError

      const outputConverter = outputConverters[converterName];

      if (!converterName || !outputConverter) {
        log.warn(errorCreator('converter for valueType is missing')({
          valueType
        }));
        return '';
      }

      outputValue = outputConverter(normalizedValue);
    } else {
      outputValue = normalizedValue;
    }

    return outputValue;
  }

  function createAssignValueEffect(effect, element, targetDataType) {
    const normalizedValue = normalizeRuleVariable(effect.data, element.valueType);
    const outputValue = convertNormalizedValueToOutputValue(normalizedValue, element.valueType);
    return {
      type: effectActions.ASSIGN_VALUE,
      id: element.id,
      value: outputValue,
      targetDataType
    };
  }

  function processAssignValue(effect, dataElements, trackedEntityAttributes) {
    const effects = [];

    if (dataElements && effect.dataElementId && dataElements[effect.dataElementId]) {
      effects.push(createAssignValueEffect(effect, dataElements[effect.dataElementId], rulesEngineEffectTargetDataTypes.DATA_ELEMENT));
    }

    if (trackedEntityAttributes && effect.trackedEntityAttributeId && trackedEntityAttributes[effect.trackedEntityAttributeId]) {
      effects.push(createAssignValueEffect(effect, trackedEntityAttributes[effect.trackedEntityAttributeId], rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE));
    }

    return effects;
  }

  function processHideField(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: effectActions.HIDE_FIELD
    }));
  }

  function processShowError(effect) {
    return createErrorEffect(effect, effectActions.SHOW_ERROR);
  }

  function processShowWarning(effect) {
    return createWarningEffect(effect, effectActions.SHOW_WARNING);
  }

  function processShowErrorOnComplete(effect) {
    return createErrorEffect(effect, effectActions.SHOW_ERROR_ONCOMPLETE);
  }

  function processShowWarningOnComplete(effect) {
    return createWarningEffect(effect, effectActions.SHOW_WARNING_ONCOMPLETE);
  }

  function processHideSection(effect) {
    if (!effect.programStageSectionId) {
      return null;
    }

    return {
      type: effectActions.HIDE_SECTION,
      id: effect.programStageSectionId
    };
  }

  function processMakeCompulsory(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: effectActions.MAKE_COMPULSORY
    }));
  }

  function processDisplayText(effect) {
    const message = effect.displayContent || '';
    return {
      type: effectActions.DISPLAY_TEXT,
      id: effect.location,
      displayText: {
        id: effect.id,
        message: "".concat(message, " ").concat(sanitiseFalsy(effect.data)),
        ...effect.style
      }
    };
  }

  function processDisplayKeyValuePair(effect) {
    return {
      type: effectActions.DISPLAY_KEY_VALUE_PAIR,
      id: effect.location,
      displayKeyValuePair: {
        id: effect.id,
        key: effect.displayContent,
        value: typeof effect.data == 'number' ? numberToString(effect.data) : String(effect.data),
        ...effect.style
      }
    };
  }

  function processHideOptionGroup(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: effectActions.HIDE_OPTION_GROUP,
      optionGroupId: effect.optionGroupId
    }));
  }

  function processHideOption(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: effectActions.HIDE_OPTION,
      optionId: effect.optionId
    }));
  }

  function processShowOptionGroup(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: effectActions.SHOW_OPTION_GROUP,
      optionGroupId: effect.optionGroupId
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
    [effectActions.SHOW_OPTION_GROUP]: processShowOptionGroup
  };

  function processRulesEffects(effects, dataElements, trackedEntityAttributes) {
    if (effects) {
      return effects.filter(_ref => {
        let {
          action
        } = _ref;
        return mapActionsToProcessor[action];
      }).flatMap(effect => mapActionsToProcessor[effect.action](effect, dataElements, trackedEntityAttributes)) // when mapActionsToProcessor function returns `null` we filter those value out.
      .filter(keepTruthyValues => keepTruthyValues);
    }

    return [];
  }

  return processRulesEffects;
}