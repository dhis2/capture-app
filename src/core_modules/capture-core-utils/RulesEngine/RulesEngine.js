// @flow
import VariableService from './VariableService/VariableService';
import ValueProcessor from './ValueProcessor/ValueProcessor';
import getExecutionService from './executionService/executionService';
import getDateUtils from './dateUtils/dateUtils';
import processTypes from './rulesEffectsProcessor/processTypes.const';
import type {
    OutputEffect,
    IConvertInputRulesValue,
    IConvertOutputRulesEffectsValue,
    IMomentConverter,
    ProgramRulesContainer,
    EventData,
    DataElements,
    OrgUnit,
    OptionSets,
    TrackedEntityAttributes,
    Enrollment,
    EventsDataContainer,
    TEIValues,
    ProgramRule,
    RuleVariables,
    ProgramRuleEffect,
} from './rulesEngine.types';

type ExecutionService = {
    getEffects: (
      programRules: ?Array<ProgramRule>,
      dataElements: ?DataElements,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      variablesHash: RuleVariables,
      processType: string,
      flag: ?{ debug: boolean },
    ) => ?Array<ProgramRuleEffect>,
    convertDataToBaseOutputValue: (data: any, valueType: string) => any,
};

export default class RulesEngine {
    executionService: ExecutionService;
    variableService: VariableService;
    onProcessRulesEffects: (
      effects: Array<ProgramRuleEffect>,
      processType: $Values<typeof processTypes>,
      dataElements: ?DataElements,
      trackedEntityAttributes?: ?TrackedEntityAttributes) => ?OutputEffects;

  constructor(
      inputConverterObject: IConvertInputRulesValue,
      momentConverter: IMomentConverter,
      outputRulesConverterObject: IConvertOutputRulesEffectsValue,
  ) {
      const dateUtils = getDateUtils(momentConverter);
      const valueProcessor = new ValueProcessor(inputConverterObject);

      this.variableService = new VariableService(valueProcessor.processValue, dateUtils);
      this.executionService = getExecutionService(this.variableService, dateUtils, outputRulesConverterObject);
  }
  executeTEIRules(
      programRulesContainer: ProgramRulesContainer,
      enrollmentData: ?Enrollment,
      teiValues: ?TEIValues,
      trackedEntityAttributes: ?TrackedEntityAttributes,
      selectedOrgUnit: OrgUnit,
      optionSets: OptionSets,
  ): ?Array<OutputEffect> {

      const variablesHash = this.variableService.getVariables(
          programRulesContainer,
          null,
          null,
          null,
          trackedEntityAttributes,
          teiValues,
          enrollmentData,
          selectedOrgUnit,
          optionSets,
      );
      const { programRules } = programRulesContainer;

        const effects = this.executionService.getEffects(
            programRules,
            dataElements,
            trackedEntityAttributes,
            variablesHash,
            processTypes.TEI,
        );

        if (effects) {
            return this.onProcessRulesEffects(effects, processType, dataElements, trackedEntityAttributes);
        }
        return null;
    }
}
