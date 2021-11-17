// @flow
import { EnrollmentFactory } from './factory';
import { TrackerProgram } from '../../../metaData';
import { getRulesAndVariablesFromProgramIndicators } from '../../../metaDataMemoryStoreBuilders/programs/getRulesAndVariablesFromIndicators';

const objToMap = (object: any) => {
    const map = new Map<string, any>();
    Object.entries(object).forEach((item: any) => {
        map.set(item[1].id, item[1]);
    });
    return map;
};

const getProgramStageSectionId = valueApi => valueApi.programStageSection && valueApi.programStageSection.id;
const getProgramStageId = valueApi => valueApi.programStage && valueApi.programStage.id;
const getDataElementId = valueApi => valueApi.dataElement && valueApi.dataElement.id;
const getTrackedEntityAttributeId = valueApi => valueApi.trackedEntityAttribute && valueApi.trackedEntityAttribute.id;
const getOptionGroupId = valueApi => valueApi.optionGroup && valueApi.optionGroup.id;
const getOptionId = valueApi => valueApi.option && valueApi.option.id;
const getProgramId = valueApi => valueApi.program && valueApi.program.id;
const getProgramRuleActions = apiProgramRuleActions =>
    apiProgramRuleActions.map(apiProgramRuleAction => ({
        ...apiProgramRuleAction,
        programStageSectionId: getProgramStageSectionId(apiProgramRuleAction),
        programStageId: getProgramStageId(apiProgramRuleAction),
        dataElementId: getDataElementId(apiProgramRuleAction),
        trackedEntityAttributeId: getTrackedEntityAttributeId(apiProgramRuleAction),
        optionGroupId: getOptionGroupId(apiProgramRuleAction),
        optionId: getOptionId(apiProgramRuleAction),
    }));

const asyncForEach = async function (callback) {
    for (let index = 0; index < this.length; index++) {
        // eslint-disable-next-line no-await-in-loop
        await callback(this[index], index, this);
    }
};

const addProgramVariables = (program, programRuleVariables) => {
    program.programRuleVariables = programRuleVariables.map(programRulesVariable => ({
        ...programRulesVariable,
        programId: getProgramId(programRulesVariable),
        trackedEntityAttributeId: getTrackedEntityAttributeId(programRulesVariable),
    }));
};

const addProgramRules = (program, programRules) => {
    const filteredProgramRules = programRules.map(programRule => ({
        ...programRule,
        programId: getProgramId(programRule),
        programRuleActions: getProgramRuleActions(programRule.programRuleActions),
    }));
    const mainRules = filteredProgramRules.filter(rule => !rule.programStageId);

    const rulesByStage = filteredProgramRules
        .filter(rule => rule.programStageId)
        .reduce((accRulesByStage, programRule) => {
            accRulesByStage[programRule.programStageId] = accRulesByStage[programRule.programStageId] || [];
            accRulesByStage[programRule.programStageId].push(programRule);
            return accRulesByStage;
        }, {});

    program.programRules = mainRules;
    Object.keys(rulesByStage).forEach((stageKey) => {
        const rulesForStage = rulesByStage[stageKey];
        const programStage = program.getStage(stageKey);
        if (programStage) {
            // $FlowFixMe[prop-missing] automated comment
            programStage.programRules = rulesForStage;
        }
    });
};

const addRulesAndVariablesFromProgramIndicators = (program, programIndicators) => {
    const indicators = programIndicators.map(programIndicator => ({
        ...programIndicator,
        programId: getProgramId(programIndicator),
    }));
    const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, program.id);

    if (variables) {
        program.programRuleVariables = [...program.programRuleVariables, ...variables];
    }
    if (rules) {
        program.programRules = [...program.programRules, ...rules];
    }
};

const convertProgramForEnrollmentFactory = (program) => {
    const { programTrackedEntityAttributes, programStages } = program;
    let convertedProgramTrackedEntityAttributes = programTrackedEntityAttributes.map(programAttribute => ({
        ...programAttribute,
        trackedEntityAttributeId: getTrackedEntityAttributeId(programAttribute),
    }));
    let convertedProgramStages = programStages;

    if (!convertedProgramTrackedEntityAttributes.asyncForEach) {
        convertedProgramTrackedEntityAttributes = [...convertedProgramTrackedEntityAttributes, asyncForEach];
    }

    if (!convertedProgramStages.asyncForEach) {
        convertedProgramStages = programStages.map(programStage => ({
            ...programStage,
            programStageDataElements: { ...programStage.programStageDataElements, asyncForEach },
        }));
        convertedProgramStages = [...convertedProgramStages, asyncForEach];
    }

    return {
        ...program,
        programTrackedEntityAttributes: convertedProgramTrackedEntityAttributes,
        programStages: convertedProgramStages,
    };
};

const buildEnrollment = async (programRules, programAPI) => {
    const trackedEntityTypes = [programAPI.trackedEntityType];
    const trackedEntityAttributes = programAPI.programTrackedEntityAttributes.reduce(
        (acc, currentValue) => [...acc, currentValue.trackedEntityAttribute],
        [],
    );
    const optionSets = trackedEntityAttributes.reduce(
        (acc, currentValue) => (currentValue.optionSet ? [...acc, currentValue.optionSet] : acc),
        [],
    );
    const cachedTrackedEntityAttributes: Map<string, any> = objToMap(trackedEntityAttributes);
    const cachedOptionSets: Map<string, any> = objToMap(optionSets);
    const cachedTrackedEntityTypes: Map<string, any> = objToMap(trackedEntityTypes);
    const trackedEntityTypeCollection: Map<string, any> = objToMap(trackedEntityTypes);

    const enrollmentFactory = new EnrollmentFactory({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        cachedTrackedEntityTypes,
        trackedEntityTypeCollection,
    });
    const cachedProgram = convertProgramForEnrollmentFactory(programAPI);
    return enrollmentFactory.build(cachedProgram);
};

export const buildProgram = async ({
    programRules,
    programAPI,
    setProgram,
}: {
    programRules: any,
    programAPI: any,
    setProgram: (enrollment: any) => void,
}) => {
    const enrollment = await buildEnrollment(programRules, programAPI);

    const program = new TrackerProgram((trackerProgram) => {
        trackerProgram.id = programAPI.id;
        trackerProgram.access = programAPI.access;
        trackerProgram.name = programAPI.displayName;
        trackerProgram.shortName = programAPI.displayShortName;
        trackerProgram.trackedEntityType = programAPI.trackedEntityType;
        trackerProgram.enrollment = enrollment;
    });

    const { programRuleVariables, programIndicators } = programAPI;
    programRuleVariables && addProgramVariables(program, programRuleVariables);
    programRules && addProgramRules(program, programRules);
    programIndicators && addRulesAndVariablesFromProgramIndicators(program, programIndicators);

    setProgram(program);
};
