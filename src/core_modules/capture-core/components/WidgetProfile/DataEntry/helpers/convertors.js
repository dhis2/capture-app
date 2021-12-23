// @flow

export const getProgramStageSectionId = (valueApi: any) => valueApi?.programStageSection?.id;

export const getProgramStageId = (valueApi: any) => valueApi?.programStage?.id;

export const getDataElementId = (valueApi: any) => valueApi?.dataElement?.id;

export const getTrackedEntityAttributeId = (valueApi: any) => valueApi?.trackedEntityAttribute?.id;

export const getOptionGroupId = (valueApi: any) => valueApi?.optionGroup?.id;

export const getOptionId = (valueApi: any) => valueApi?.option?.id;

export const getOptionSetId = (valueApi: any) => valueApi?.optionSet?.id;

export const getProgramId = (valueApi: any) => valueApi?.program?.id;

export const getTrackedEntityTypeId = (valueApi: any) => valueApi?.trackedEntityType?.id;

export const getProgramTrackedEntityAttributes = (valueApi: any) =>
    valueApi?.map(programAttribute => ({
        ...programAttribute,
        trackedEntityAttributeId: getTrackedEntityAttributeId(programAttribute),
    }));

export const getProgramRuleActions = (valueApi: any) =>
    valueApi?.map(apiProgramRuleAction => ({
        ...apiProgramRuleAction,
        programStageSectionId: getProgramStageSectionId(apiProgramRuleAction),
        programStageId: getProgramStageId(apiProgramRuleAction),
        dataElementId: getDataElementId(apiProgramRuleAction),
        trackedEntityAttributeId: getTrackedEntityAttributeId(apiProgramRuleAction),
        optionGroupId: getOptionGroupId(apiProgramRuleAction),
        optionId: getOptionId(apiProgramRuleAction),
    }));
