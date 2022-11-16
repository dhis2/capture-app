"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRulesEffectsProcessor = getRulesEffectsProcessor;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _errorCreator = require("../../errorCreator");

var _constants = require("../../constants");

var _commonUtils = require("../../commonUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sanitiseFalsy = value => {
  if (value) {
    return value;
  }

  if (value === 0) {
    return 0;
  }

  return '';
};

function getRulesEffectsProcessor(outputConverters) {
  const idNamesArray = [_constants.idNames.DATA_ELEMENT_ID, _constants.idNames.TRACKED_ENTITY_ATTRIBUTE_ID];

  function createEffectsForConfiguredDataTypes(effect, getOutputEffect) {
    return idNamesArray.filter(idName => effect[idName]).map(idName => {
      const outputEffect = getOutputEffect();
      outputEffect.id = effect[idName];
      outputEffect.targetDataType = idName === _constants.idNames.DATA_ELEMENT_ID ? _constants.rulesEngineEffectTargetDataTypes.DATA_ELEMENT : _constants.rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE;
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
      const converterName = _constants.mapTypeToInterfaceFnName[valueType]; // $FlowExpectedError

      const outputConverter = outputConverters[converterName];

      if (!converterName || !outputConverter) {
        _loglevel.default.warn((0, _errorCreator.errorCreator)('converter for valueType is missing')({
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
    const normalizedValue = (0, _commonUtils.normalizeRuleVariable)(effect.data, element.valueType);
    const outputValue = convertNormalizedValueToOutputValue(normalizedValue, element.valueType);
    return {
      type: _constants.effectActions.ASSIGN_VALUE,
      id: element.id,
      value: outputValue,
      targetDataType
    };
  }

  function processAssignValue(effect, dataElements, trackedEntityAttributes) {
    const effects = [];

    if (dataElements && effect.dataElementId && dataElements[effect.dataElementId]) {
      effects.push(createAssignValueEffect(effect, dataElements[effect.dataElementId], _constants.rulesEngineEffectTargetDataTypes.DATA_ELEMENT));
    }

    if (trackedEntityAttributes && effect.trackedEntityAttributeId && trackedEntityAttributes[effect.trackedEntityAttributeId]) {
      effects.push(createAssignValueEffect(effect, trackedEntityAttributes[effect.trackedEntityAttributeId], _constants.rulesEngineEffectTargetDataTypes.TRACKED_ENTITY_ATTRIBUTE));
    }

    return effects;
  }

  function processHideField(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: _constants.effectActions.HIDE_FIELD
    }));
  }

  function processShowError(effect) {
    return createErrorEffect(effect, _constants.effectActions.SHOW_ERROR);
  }

  function processShowWarning(effect) {
    return createWarningEffect(effect, _constants.effectActions.SHOW_WARNING);
  }

  function processShowErrorOnComplete(effect) {
    return createErrorEffect(effect, _constants.effectActions.SHOW_ERROR_ONCOMPLETE);
  }

  function processShowWarningOnComplete(effect) {
    return createWarningEffect(effect, _constants.effectActions.SHOW_WARNING_ONCOMPLETE);
  }

  function processHideSection(effect) {
    if (!effect.programStageSectionId) {
      return null;
    }

    return {
      type: _constants.effectActions.HIDE_SECTION,
      id: effect.programStageSectionId
    };
  }

  function processMakeCompulsory(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: _constants.effectActions.MAKE_COMPULSORY
    }));
  }

  function processDisplayText(effect) {
    const message = effect.displayContent || '';
    return {
      type: _constants.effectActions.DISPLAY_TEXT,
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
      type: _constants.effectActions.DISPLAY_KEY_VALUE_PAIR,
      id: effect.location,
      displayKeyValuePair: {
        id: effect.id,
        key: effect.displayContent,
        value: typeof effect.data == 'number' ? (0, _commonUtils.numberToString)(effect.data) : String(effect.data),
        ...effect.style
      }
    };
  }

  function processHideOptionGroup(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: _constants.effectActions.HIDE_OPTION_GROUP,
      optionGroupId: effect.optionGroupId
    }));
  }

  function processHideOption(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: _constants.effectActions.HIDE_OPTION,
      optionId: effect.optionId
    }));
  }

  function processShowOptionGroup(effect) {
    return createEffectsForConfiguredDataTypes(effect, () => ({
      type: _constants.effectActions.SHOW_OPTION_GROUP,
      optionGroupId: effect.optionGroupId
    }));
  }

  const mapActionsToProcessor = {
    [_constants.effectActions.ASSIGN_VALUE]: processAssignValue,
    [_constants.effectActions.HIDE_FIELD]: processHideField,
    [_constants.effectActions.SHOW_ERROR]: processShowError,
    [_constants.effectActions.SHOW_WARNING]: processShowWarning,
    [_constants.effectActions.SHOW_ERROR_ONCOMPLETE]: processShowErrorOnComplete,
    [_constants.effectActions.SHOW_WARNING_ONCOMPLETE]: processShowWarningOnComplete,
    [_constants.effectActions.HIDE_SECTION]: processHideSection,
    [_constants.effectActions.MAKE_COMPULSORY]: processMakeCompulsory,
    [_constants.effectActions.DISPLAY_TEXT]: processDisplayText,
    [_constants.effectActions.DISPLAY_KEY_VALUE_PAIR]: processDisplayKeyValuePair,
    [_constants.effectActions.HIDE_OPTION_GROUP]: processHideOptionGroup,
    [_constants.effectActions.HIDE_OPTION]: processHideOption,
    [_constants.effectActions.SHOW_OPTION_GROUP]: processShowOptionGroup
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