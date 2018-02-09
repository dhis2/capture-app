// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

function convertFromCollectionToArray(collection) {
    if (!collection || collection.size === 0) {
        return [];
    }
    return [...collection.toArray()];
}

function getProgramRuleActions(d2ProgramRuleActionsCollection): Array<ProgramRuleAction> {
    const d2ProgramRuleActions = convertFromCollectionToArray(d2ProgramRuleActionsCollection);
    return d2ProgramRuleActions.map(programRuleAction => ({
        dataElement: {
            id: programRuleAction.dataElement && programRuleAction.dataElement.id,
        },
        programRuleActionType: programRuleAction.programRuleActionType,
        programStage: {
            id: programRuleAction.programStage && programRuleAction.programStage.id,
        },
        programStageSection: {
            id: programRuleAction.programStageSection && programRuleAction.programStageSection.id,
        },
        trackedEntityAttribute: {
            id: programRuleAction.trackedEntityAttribute && programRuleAction.trackedEntityAttribute.id,
        },
    }));
}


export default new ApiSpecification((_this) => {
    _this.modelName = 'programRules';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],programIndicator[id],programStage[id]]',
        filter: 'program.id:in:',
    };
    _this.converter = (d2ProgramRules: ?Array<ProgramRule>) => {
        if (!d2ProgramRules || d2ProgramRules.length === 0) {
            return null;
        }

        const programRules = d2ProgramRules.map(d2ProgramRule => ({
            id: d2ProgramRule.id,
            condition: d2ProgramRule.condition,
            description: d2ProgramRule.description,
            displayName: d2ProgramRule.displayName,
            program: {
                id: d2ProgramRule.program.id,
            },
            programRuleActions: getProgramRuleActions(d2ProgramRule.programRuleActions),
        }));

        return programRules;
    };
});
