export const getProgramStageSectionId = (valueApi: any): string | undefined => valueApi?.programStageSection?.id;

export const getProgramStageId = (valueApi: any): string | undefined => valueApi?.programStage?.id;

export const getDataElementId = (valueApi: any): string | undefined => valueApi?.dataElement?.id;

export const getTrackedEntityAttributeId = (valueApi: any): string | undefined => valueApi?.trackedEntityAttribute?.id;

export const getOptionGroupId = (valueApi: any): string | undefined => valueApi?.optionGroup?.id;

export const getOptionId = (valueApi: any): string | undefined => valueApi?.option?.id;

export const getOptionSetId = (valueApi: any): string | undefined => valueApi?.optionSet?.id;

export const getProgramId = (valueApi: any): string | undefined => valueApi?.program?.id;

export const getTrackedEntityTypeId = (valueApi: any): string | undefined => valueApi?.trackedEntityType?.id;

export const getProgramTrackedEntityAttributes = (valueApi: any[]): any[] =>
    valueApi?.map(programAttribute => ({
        ...programAttribute,
        trackedEntityAttributeId: getTrackedEntityAttributeId(programAttribute),
    }));

export const getProgramRuleActions = (valueApi: any[]): any[] =>
    valueApi?.map(apiProgramRuleAction => ({
        ...apiProgramRuleAction,
        programStageSectionId: getProgramStageSectionId(apiProgramRuleAction),
        programStageId: getProgramStageId(apiProgramRuleAction),
        dataElementId: getDataElementId(apiProgramRuleAction),
        trackedEntityAttributeId: getTrackedEntityAttributeId(apiProgramRuleAction),
        optionGroupId: getOptionGroupId(apiProgramRuleAction),
        optionId: getOptionId(apiProgramRuleAction),
    }));
