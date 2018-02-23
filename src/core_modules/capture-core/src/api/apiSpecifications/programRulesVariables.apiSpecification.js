// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'programRuleVariables';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet',
        filter: 'program.id:in:',
    };
    _this.converter = (d2ProgramRulesVariables: ?Array<ProgramRuleVariable>) => {
        if (!d2ProgramRulesVariables || d2ProgramRulesVariables.length === 0) {
            return null;
        }

        return d2ProgramRulesVariables.map(d2RuleVariable => ({
            id: d2RuleVariable.id,
            dataElement: {
                id: d2RuleVariable.dataElement && d2RuleVariable.dataElement.id,
            },
            trackedEntityAttribute: {
                id: d2RuleVariable.trackedEntityAttribute && d2RuleVariable.trackedEntityAttribute.id,
            },
            displayName: d2RuleVariable.displayName,
            program: {
                id: d2RuleVariable.program && d2RuleVariable.program.id,
            },
            programStage: {
                id: d2RuleVariable.programStage && d2RuleVariable.programStage.id,
            },
            programRuleVariableSourceType: d2RuleVariable.programRuleVariableSourceType,
            useNameForOptionSet: !d2RuleVariable.useCodeForOptionSet,
        }));
    };
});
