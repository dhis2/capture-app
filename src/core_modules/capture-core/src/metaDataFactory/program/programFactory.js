// @flow
/* eslint-disable complexity */
import log from 'loglevel';

import programCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import Program from '../../metaData/Program/Program';
import Icon from '../../metaData/Icon/Icon';

import EventProgram from '../../metaData/Program/EventProgram';
import TrackerProgram from '../../metaData/Program/TrackerProgram';

import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import Section from '../../metaData/RenderFoundation/Section';
import CustomForm from '../../metaData/RenderFoundation/CustomForm';
import DataElement from '../../metaData/DataElement/DataElement';
import OptionSet from '../../metaData/OptionSet/OptionSet';
import { inputTypes } from '../../metaData/OptionSet/optionSet.const';
import Option from '../../metaData/OptionSet/Option';
import CategoryCombination from '../../metaData/CategoryCombinations/CategoryCombination';
import Category from '../../metaData/CategoryCombinations/Category';

import getProgramIconAsync from './getProgramIcon';
import getDhisIconAsync from './getDhisIcon';
import { convertOptionSetValue } from '../../converters/serverToClient';
import isNonEmptyArray from '../../utils/isNonEmptyArray';
import errorCreator from '../../utils/errorCreator';

import getRulesAndVariablesFromProgramIndicators from './getRulesAndVariablesFromIndicators';
import type { CachedProgramIndicator } from './getRulesAndVariablesFromIndicators';
import type { ProgramRule, ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';
import capitalizeFirstLetter from '../../utils/string/capitalizeFirstLetter';
import buildSearchGroups from './searchGroupFactory';

import type {
    CachedStyle,
    CachedDataElement,
    CachedProgramStageDataElement,
    CachedSectionDataElements,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedCategory,
    CachedCategoryCombo,
    CachedProgram,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,

} from './cache.types';

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
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
const CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

function getDataElementType(d2ValueType: string) {
    const converters = {
    };

    return converters[d2ValueType] || d2ValueType;
}

function camelCaseUppercaseString(text: string) {
    const lowerCased = text.toLowerCase();
    const camelCased = lowerCased.replace(/_(.)/g, (_, character) => character.toUpperCase());
    return camelCased;
}

function getRenderType(renderType: string) {
    return renderType && camelCaseUppercaseString(renderType);
}

async function buildOptionIcon(cachedStyle: CachedStyle = {}) {
    const icon = cachedStyle && cachedStyle.icon;
    if (!icon) {
        return null;
    }

    try {
        const iconData = await getDhisIconAsync(icon);
        return new Icon((_this) => {
            if (cachedStyle.color) {
                _this.color = cachedStyle.color;
            }
            _this.data = iconData;
        });
    } catch (error) {
        return null;
    }
}

async function buildOptionSet(
    id: string,
    dataElement: DataElement,
    renderOptionsAsRadio: ?boolean,
    renderType: string) {
    const d2OptionSet = currentD2OptionSets && currentD2OptionSets.find(d2Os => d2Os.id === id);

    if (!d2OptionSet) {
        log.warn(
            errorCreator(OPTION_SET_NOT_FOUND)({ id }),
        );
        return null;
    }

    dataElement.type = getDataElementType(d2OptionSet.valueType);

    const optionsPromises = d2OptionSet
        .options
        .map(async (d2Option) => {
            const icon = await buildOptionIcon(d2Option.style);

            return new Option((_this) => {
                _this.value = d2Option.code;
                _this.text = d2Option.displayName;
                _this.icon = icon;
            });
        });

    const options = await Promise.all(optionsPromises);

    const optionSet = new OptionSet(id, options, dataElement, convertOptionSetValue);
    optionSet.inputType = getRenderType(renderType) || (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
    return optionSet;
}

function getDataElementTranslation(d2DataElement: CachedDataElement, property: $Values<typeof propertyNames>) {
    return currentLocale && d2DataElement.translations[currentLocale] && d2DataElement.translations[currentLocale][property];
}

async function buildDataElementIconAsync(cachedStyle: CachedStyle = {}) {
    const icon = cachedStyle && cachedStyle.icon;
    if (!icon) {
        return null;
    }

    try {
        const iconData = await getDhisIconAsync(icon);
        return new Icon((_this) => {
            if (cachedStyle.color) {
                _this.color = cachedStyle.color;
            }
            _this.data = iconData;
        });
    } catch (error) {
        return null;
    }
}

async function buildDataElement(d2ProgramStageDataElement: CachedProgramStageDataElement) {
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

    dataElement.icon = await buildDataElementIconAsync(d2DataElement.style);

    if (d2DataElement.optionSet && d2DataElement.optionSet.id) {
        dataElement.optionSet = await buildOptionSet(
            d2DataElement.optionSet.id,
            dataElement,
            d2ProgramStageDataElement.renderOptionsAsRadio,
            d2ProgramStageDataElement.renderType && d2ProgramStageDataElement.renderType.DESKTOP && d2ProgramStageDataElement.renderType.DESKTOP.type);
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

async function buildSection(
    d2ProgramStageDataElements: CachedProgramStageDataElementsAsObject,
    sectionSpecs: SectionSpecs) {
    const section = new Section((_this) => {
        _this.id = sectionSpecs.id;
        _this.name = sectionSpecs.displayName;
    });

    if (sectionSpecs.dataElements) {
        await sectionSpecs.dataElements.asyncForEach(async (sectionDataElement: CachedSectionDataElements) => {
            const id = sectionDataElement.id;
            const d2ProgramStageDataElement = d2ProgramStageDataElements[id];
            section.addElement(await buildDataElement(d2ProgramStageDataElement));
        });
    }

    return section;
}

async function buildMainSection(d2ProgramStageDataElements: ?Array<CachedProgramStageDataElement>) {
    const section = new Section((_this) => {
        _this.id = Section.MAIN_SECTION_ID;
    });

    if (d2ProgramStageDataElements) {
        await d2ProgramStageDataElements.asyncForEach((async (d2ProgramStageDataElement) => {
            section.addElement(await buildDataElement(d2ProgramStageDataElement));
        }));
    }

    return section;
}

function getFeatureType(d2ProgramStage: CachedProgramStage) {
    return d2ProgramStage.featureType ?
        capitalizeFirstLetter(d2ProgramStage.featureType.toLowerCase())
        :
        'None';
}

async function buildStage(d2ProgramStage: CachedProgramStage) {
    const stage = new RenderFoundation((_this) => {
        _this.id = d2ProgramStage.id;
        _this.access = d2ProgramStage.access;
        _this.name = d2ProgramStage.displayName;
        _this.description = d2ProgramStage.description;
        _this.featureType = capitalizeFirstLetter(getFeatureType(d2ProgramStage));
        _this.addLabel({ id: 'eventDate', label: d2ProgramStage.executionDateLabel || 'Incident date' });
        _this.validationStrategy =
            d2ProgramStage.validationStrategy && camelCaseUppercaseString(d2ProgramStage.validationStrategy);
    });

    if (d2ProgramStage.formType === 'CUSTOM' && d2ProgramStage.dataEntryForm) {
        const section = await buildMainSection(d2ProgramStage.programStageDataElements);
        section.showContainer = false;
        stage.addSection(section);
        const dataEntryForm = d2ProgramStage.dataEntryForm;
        try {
            stage.customForm = new CustomForm((_this) => {
                _this.id = dataEntryForm.id;
                _this.data = dataEntryForm.htmlCode;
            });
        } catch (error) {
            log.error(errorCreator(CUSTOM_FORM_TEMPLATE_ERROR)({ template: dataEntryForm.htmlCode, error }));
        }
    } else if (isNonEmptyArray(d2ProgramStage.programStageSections)) {
        const d2ProgramStageDataElementsAsObject =
            convertProgramStageDataElementsToObject(d2ProgramStage.programStageDataElements);
        // $FlowSuppress
        await d2ProgramStage.programStageSections.asyncForEach(async (section: CachedProgramStageSection) => {
            stage.addSection(await buildSection(d2ProgramStageDataElementsAsObject, {
                id: section.id,
                displayName: section.displayName,
                dataElements: section.dataElements,
            }));
        });
    } else {
        stage.addSection(await buildMainSection(d2ProgramStage.programStageDataElements));
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

async function buildProgramIcon(cachedStyle: CachedStyle = {}) {
    const icon = new Icon();
    icon.color = cachedStyle.color || '#e0e0e0';
    icon.data = await getProgramIconAsync(cachedStyle.icon);

    return icon;
}

async function buildProgram(d2Program: CachedProgram) {
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
        program.stage = await buildStage(d2Stage);
    } else {
        program = new TrackerProgram((_this) => {
            _this.id = d2Program.id;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
        });

        program.searchGroups = await buildSearchGroups(d2Program, currentLocale);
        await d2Program.programStages.asyncForEach(async (d2ProgramStage: CachedProgramStage) => {
            program.addStage(await buildStage(d2ProgramStage));
        });
    }

    program.icon = await buildProgramIcon(d2Program.style);

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
        const programId = indicator.programId;
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

export default async function buildProgramCollection(
    cachedPrograms: ?Array<CachedProgram>,
    cachedOptionSets: ?Array<CachedOptionSet>,
    cachedProgramRulesVariables: ?Array<ProgramRuleVariable>,
    cachedProgramRules: ?Array<ProgramRule>,
    cachedProgramIndicators: ?Array<CachedProgramIndicator>,
    locale: ?string) {
    currentLocale = locale;
    currentD2OptionSets = cachedOptionSets;

    if (cachedPrograms) {
        const promisePrograms = cachedPrograms.map(async (d2Program) => {
            const program = await buildProgram(d2Program);
            return program;
        });
        const programs = await Promise.all(promisePrograms);

        sortPrograms(programs)
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
