// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (() => {
    const getProgramRuleActions = (apiProgramRuleActions) => {
        const resetProps = {
            programStageSection: undefined,
            programStage: undefined,
            dataElement: undefined,
            trackedEntityAttribute: undefined,
            optionGroup: undefined,
            option: undefined,
        };

        const getProgramStageSectionId = d2ProgramRuleAction =>
            d2ProgramRuleAction.programStageSection && d2ProgramRuleAction.programStageSection.id;
        const getProgramStageId = d2ProgramRuleAction =>
            d2ProgramRuleAction.programStage && d2ProgramRuleAction.programStage.id;
        const getDataElementId = d2ProgramRuleAction =>
            d2ProgramRuleAction.dataElement && d2ProgramRuleAction.dataElement.id;
        const getTrackedEntityAttributeId = d2ProgramRuleAction =>
            d2ProgramRuleAction.trackedEntityAttribute && d2ProgramRuleAction.trackedEntityAttribute.id;
        const getOptionGroupId = d2ProgramRuleAction =>
            d2ProgramRuleAction.optionGroup && d2ProgramRuleAction.optionGroup.id;
        const getOptionId = d2ProgramRuleAction =>
            d2ProgramRuleAction.option && d2ProgramRuleAction.option.id;

        return apiProgramRuleActions.map(apiProgramRuleAction => ({
            ...apiProgramRuleAction,
            ...resetProps,
            programStageSectionId: getProgramStageSectionId(apiProgramRuleAction),
            programStageId: getProgramStageId(apiProgramRuleAction),
            dataElementId: getDataElementId(apiProgramRuleAction),
            trackedEntityAttributeId: getTrackedEntityAttributeId(apiProgramRuleAction),
            optionGroupId: getOptionGroupId(apiProgramRuleAction),
            optionId: getOptionId(apiProgramRuleAction),
        }));
    };

    return (response) => {
        const apiProgramRules = (response && response.programRules) || [];

        return apiProgramRules
            .map(apiProgramRule => ({
                ...apiProgramRule,
                // This object is stored in IndexedDB. When a property points to an object containing only an id property, the id property is moved up one level to the parent object.
                // In this instance, program is replaced by programId and programStage is replaced by programStageId.
                program: undefined,
                programStage: undefined,
                programId: apiProgramRule.program && apiProgramRule.program.id,
                programStageId: apiProgramRule.programStage && apiProgramRule.programStage.id,
                programRuleActions: getProgramRuleActions(apiProgramRule.programRuleActions),
            }));
    };
})();

const fieldsParam = 'id,displayName,condition,description,program[id],programStage[id],priority,' +
'programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],' +
'trackedEntityAttribute[id],programStage[id],optionGroup[id],option[id]]';

export const storeProgramRules = (programIds: Array<string>) => {
    const query = {
        resource: 'programRules',
        params: {
            fields: fieldsParam,
            filter: `program.id:in:[${programIds.join(',')}]`,
        },
    };
    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.PROGRAM_RULES,
        convertQueryResponse: convert,
    });
};
