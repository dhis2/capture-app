// @flow
/* eslint-disable complexity */
import log from 'loglevel';

import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import Program from '../../metaData/Program/Program';

import EventProgram from '../../metaData/Program/EventProgram';
import TrackerProgram from '../../metaData/Program/TrackerProgram';

import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import Section from '../../metaData/RenderFoundation/Section';
import DataElement from '../../metaData/DataElement/DataElement';
import OptionSet from '../../metaData/OptionSet/OptionSet';
import { inputTypes } from '../../metaData/OptionSet/optionSet.const';
import Option from '../../metaData/OptionSet/Option';
import CategoryCombination from '../../metaData/CategoryCombinations/CategoryCombination';
import Category from '../../metaData/CategoryCombinations/Category';

import { convertOptionSetValue } from '../../converters/serverToClient';
import isNonEmptyArray from '../../utils/isNonEmptyArray';
import errorCreator from '../../utils/errorCreator';

import getRulesAndVariablesFromProgramIndicators from './getRulesAndVariablesFromIndicators';
import type { CachedProgramIndicator } from './getRulesAndVariablesFromIndicators';
import type { ProgramRule, ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';

type CachedTranslation = {
    property: string,
    locale: string,
    value: string
};

type CachedDataElement = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: Array<CachedTranslation>,
    description: string,
    optionSetValue: boolean,
    optionSet: { id: string }
};

type CachedProgramStageDataElement = {
    compulsory: boolean,
    displayInReports: boolean,
    renderOptionsAsRadio?: ?boolean,
    dataElement: CachedDataElement
};

type CachedSectionDataElements = {
    id: string
};

type CachedProgramStageSection = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
};

type CachedProgramStage = {
    id: string,
    access: Object,
    displayName: string,
    description: ?string,
    executionDateLabel?: ?string,
    programStageSections: ?Array<CachedProgramStageSection>,
    programStageDataElements: ?Array<CachedProgramStageDataElement>
};

type CachedCategoryOption = {
    id: string,
    displayName: string,
};

type CachedCategory = {
    id: string,
    displayName: string,
    categoryOptions: ?Array<CachedCategoryOption>,
};

type CachedCategoryCombo = {
    id: string,
    displayName: string,
    categories: ?Array<CachedCategory>,
    isDefault: boolean,
};

type CachedProgram = {
    id: string,
    access: Object,
    displayName: string,
    displayShortName: string,
    organisationUnits: Array<Object>,
    programStages: Array<CachedProgramStage>,
    programType: string,
    categoryCombo: ?CachedCategoryCombo,
};

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
};

type CachedProgramStageDataElementsAsObject = {
    [id: string]: CachedProgramStageDataElement
};

type CachedOption = {
    id: string,
    code: string,
    displayName: string
};

type CachedOptionSet = {
    id: string,
    valueType: string,
    options: Array<CachedOption>
};

let currentLocale: ?string;
let currentD2OptionSets: ?Array<CachedOptionSet>;

const propertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
    FORM_NAME: 'FORM_NAME',
};

const OPTION_SET_NOT_FOUND = 'Optionset not found';

function getDataElementType(d2ValueType: string) {
    const converters = {
    };

    return converters[d2ValueType] || d2ValueType;
}

function buildOptionSet(id: string, dataElement: DataElement, renderOptionsAsRadio: ?boolean) {
    const d2OptionSet = currentD2OptionSets && currentD2OptionSets.find(d2Os => d2Os.id === id);

    if (!d2OptionSet) {
        log.warn(
            errorCreator(OPTION_SET_NOT_FOUND)({ id }),
        );
        return null;
    }

    dataElement.type = getDataElementType(d2OptionSet.valueType);

    const options = d2OptionSet.options.map(d2Option =>
        new Option((_this) => {
            _this.value = d2Option.code;
            _this.text = d2Option.displayName;
        }),
    );

    const optionSet = new OptionSet(id, options, dataElement, convertOptionSetValue);
    optionSet.inputType = renderOptionsAsRadio ? inputTypes.RADIO : null;
    return optionSet;
}

function getDataElementTranslation(d2DataElement: CachedDataElement, property: $Values<typeof propertyNames>) {
    return currentLocale && d2DataElement.translations[currentLocale] && d2DataElement.translations[currentLocale][property];
}

function buildDataElement(d2ProgramStageDataElement: CachedProgramStageDataElement) {
    const d2DataElement = d2ProgramStageDataElement.dataElement;

    const dataElement = new DataElement((_this) => {
        _this.id = d2DataElement.id;
        _this.name = getDataElementTranslation(d2DataElement, propertyNames.NAME) || d2DataElement.displayName;
        _this.shortName = getDataElementTranslation(d2DataElement, propertyNames.SHORT_NAME) || d2DataElement.displayShortName;
        _this.formName = getDataElementTranslation(d2DataElement, propertyNames.FORM_NAME) || d2DataElement.displayFormName;
        _this.description = getDataElementTranslation(d2DataElement, propertyNames.DESCRIPTION) || d2DataElement.description;
        _this.displayInForms = true;
        _this.displayInReports = d2ProgramStageDataElement.displayInReports;
        _this.compulsory = d2ProgramStageDataElement.compulsory;
        _this.disabled = false;
        _this.type = getDataElementType(d2DataElement.valueType);
    });

    if (d2DataElement.optionSet && d2DataElement.optionSet.id) {
        dataElement.optionSet = buildOptionSet(d2DataElement.optionSet.id, dataElement, d2ProgramStageDataElement.renderOptionsAsRadio);
    }

    return dataElement;
}

function convertProgramStageDataElementsToObject(d2ProgramStageDataElements: ?Array<CachedProgramStageDataElement>): CachedProgramStageDataElementsAsObject {
    if (!d2ProgramStageDataElements) {
        return {};
    }

    return d2ProgramStageDataElements.reduce((accObject, d2ProgramStageDataElement) => {
        accObject[d2ProgramStageDataElement.dataElement.id] = d2ProgramStageDataElement;
        return accObject;
    }, {});
}

function buildSection(d2ProgramStageDataElements: CachedProgramStageDataElementsAsObject, sectionSpecs: SectionSpecs) {
    const section = new Section((_this) => {
        _this.id = sectionSpecs.id;
        _this.name = sectionSpecs.displayName;
    });

    if (sectionSpecs.dataElements) {
        sectionSpecs.dataElements.forEach((sectionDataElement: CachedSectionDataElements) => {
            const id = sectionDataElement.id;
            const d2ProgramStageDataElement = d2ProgramStageDataElements[id];
            section.addElement(buildDataElement(d2ProgramStageDataElement));
        });
    }

    return section;
}

function buildMainSection(d2ProgramStageDataElements: ?Array<CachedProgramStageDataElement>) {
    const section = new Section((_this) => {
        _this.id = Section.MAIN_SECTION_ID;
    });

    if (d2ProgramStageDataElements) {
        d2ProgramStageDataElements.forEach(((d2ProgramStageDataElement) => {
            section.addElement(buildDataElement(d2ProgramStageDataElement));
        }));
    }
    return section;
}

function buildStage(d2ProgramStage: CachedProgramStage) {
    const stage = new RenderFoundation((_this) => {
        _this.id = d2ProgramStage.id;
        _this.access = d2ProgramStage.access;
        _this.name = d2ProgramStage.displayName;
        _this.description = d2ProgramStage.description;
        _this.addLabel({ id: 'eventDate', label: d2ProgramStage.executionDateLabel || 'Incident date' });
    });

    if (isNonEmptyArray(d2ProgramStage.programStageSections)) {
        const d2ProgramStageDataElementsAsObject = convertProgramStageDataElementsToObject(d2ProgramStage.programStageDataElements);
        // $FlowSuppress
        d2ProgramStage.programStageSections.forEach((section: CachedProgramStageSection) => {
            stage.addSection(buildSection(d2ProgramStageDataElementsAsObject, {
                id: section.id,
                displayName: section.displayName,
                dataElements: section.dataElements,
            }));
        });
    } else {
        stage.addSection(buildMainSection(d2ProgramStage.programStageDataElements));
    }

    return stage;
}


function buildCategories(cachedCategories: Array<CachedCategory>) {
    return cachedCategories
        .map(cachedCategory =>
            new Category((_this) => {
                _this.id = cachedCategory.id;
                _this.name = cachedCategory.displayName;
                _this.categoryOptions = cachedCategory.categoryOptions ? cachedCategory.categoryOptions.map(cachedOption => ({
                    id: cachedOption.id,
                    name: cachedOption.displayName,
                })) : null;
            }),
        );
}

function buildCategoriCombination(cachedCategoriCombination: ?CachedCategoryCombo) {
    if (!(
        cachedCategoriCombination &&
        !cachedCategoriCombination.isDefault &&
        cachedCategoriCombination.categories &&
        cachedCategoriCombination.categories.length > 0
    )) {
        return null;
    }

    return new CategoryCombination((_this) => {
        // $FlowSuppress
        _this.name = cachedCategoriCombination.displayName;
        // $FlowSuppress
        _this.id = cachedCategoriCombination.id;
        // $FlowSuppress
        _this.categories = buildCategories(cachedCategoriCombination.categories);
    });
}

function buildProgram(d2Program: CachedProgram) {
    let program;
    if (d2Program.programType === 'WITHOUT_REGISTRATION') {
        program = new EventProgram((_this) => {
            _this.id = d2Program.id;
            _this.access = d2Program.access;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
            _this.organisationUnits = d2Program.organisationUnits;
            _this.categoryCombination = buildCategoriCombination(d2Program.categoryCombo);
        });
        const d2Stage = d2Program.programStages && d2Program.programStages[0];
        program.stage = buildStage(d2Stage);
    } else {
        program = new TrackerProgram((_this) => {
            _this.id = d2Program.id;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
        });

        d2Program.programStages.forEach((d2ProgramStage: CachedProgramStage) => {
            program.addStage(buildStage(d2ProgramStage));
        });
    }
    return program;
}

function addProgramVariables(d2ProgramRulesVariables: Array<ProgramRuleVariable>) {
    const rulesVariablesByProgram = d2ProgramRulesVariables.reduce((accRulesVariablesByProgram, d2RuleVariable) => {
        const ruleVariableProgramId = d2RuleVariable.programId;
        accRulesVariablesByProgram[ruleVariableProgramId] = accRulesVariablesByProgram[ruleVariableProgramId] || [];
        accRulesVariablesByProgram[ruleVariableProgramId].push(d2RuleVariable);
        return accRulesVariablesByProgram;
    }, {});

    Object.keys(rulesVariablesByProgram).forEach((programKey) => {
        const programRulesVariables = rulesVariablesByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            program.programRuleVariables = programRulesVariables;
        }
    });
}

function addProgramRules(d2ProgramRules: Array<ProgramRule>) {
    const rulesByProgram = d2ProgramRules.reduce((accRulesByProgram, d2Rule) => {
        const ruleProgramId = d2Rule.programId;
        accRulesByProgram[ruleProgramId] = accRulesByProgram[ruleProgramId] || [];
        accRulesByProgram[ruleProgramId].push(d2Rule);
        return accRulesByProgram;
    }, {});

    Object.keys(rulesByProgram).forEach((programKey) => {
        const programRules = rulesByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            const mainRules = programRules
                .filter(rule => !rule.programStageId);

            const rulesByStage = programRules
                .filter(rule => rule.programStageId)
                .reduce((accRulesByStage, programRule) => {
                    accRulesByStage[programRule.programStageId] = accRulesByStage[programRule.programStageId] || [];
                    accRulesByStage[programRule.programStageId].push(programRule);
                    return accRulesByStage;
                }, {});

            program.programRules = mainRules;
            Object
                .keys(rulesByStage)
                .forEach((stageKey) => {
                    const rulesForStage = rulesByStage[stageKey];
                    const programStage = program.getStage(stageKey);
                    if (programStage) {
                        programStage.programRules = rulesForStage;
                    }
                });
        }
    });
}

function addRulesAndVariablesFromProgramIndicators(cachedProgramIndicators: Array<CachedProgramIndicator>) {
    const indicatorsByProgram = cachedProgramIndicators.reduce((accIndicatorsByProgram, indicator) => {
        const programId = indicator.program && indicator.program.id;
        accIndicatorsByProgram[programId] = accIndicatorsByProgram[programId] || [];
        accIndicatorsByProgram[programId].push(indicator);
        return accIndicatorsByProgram;
    }, {});

    Object.keys(indicatorsByProgram).forEach((programKey) => {
        const indicators = indicatorsByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            const { rules, variables } = getRulesAndVariablesFromProgramIndicators(indicators, programKey);
            rules && program.addProgramRules(rules);
            variables && program.addProgramRuleVariables(variables);
        }
    });
}

function sortPrograms(programs: Array<Program>) {
    programs.sort((a, b) => {
        if (a.name === b.name) {
            return 0;
        } else if (a.name > b.name) {
            return 1;
        }
        return -1;
    });
    return programs;
}

export default function buildProgramCollection(
    cachedPrograms: ?Array<CachedProgram>,
    cachedOptionSets: ?Array<CachedOptionSet>,
    cachedProgramRulesVariables: ?Array<ProgramRuleVariable>,
    cachedProgramRules: ?Array<ProgramRule>,
    cachedProgramIndicators: ?Array<CachedProgramIndicator>,
    locale: ?string) {
    currentLocale = locale;
    currentD2OptionSets = cachedOptionSets;

    if (cachedPrograms) {
        sortPrograms(
            cachedPrograms.map((d2Program) => {
                const program = buildProgram(d2Program);
                return program;
            }),
        )
            .forEach((program) => {
                programCollection.set(program.id, program);
            });

        if (cachedProgramRulesVariables) {
            addProgramVariables(cachedProgramRulesVariables);
        }

        if (cachedProgramRules) {
            addProgramRules(cachedProgramRules);
        }

        if (cachedProgramIndicators) {
            addRulesAndVariablesFromProgramIndicators(cachedProgramIndicators);
        }
    }
}
