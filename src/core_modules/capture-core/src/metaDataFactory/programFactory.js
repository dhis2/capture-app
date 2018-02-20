// @flow
import log from 'loglevel';

import programCollection from '../metaDataMemoryStores/programCollection/programCollection';

import EventProgram from '../metaData/Program/EventProgram';
import TrackerProgram from '../metaData/Program/TrackerProgram';

import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import Section from '../metaData/RenderFoundation/Section';
import DataElement from '../metaData/DataElement/DataElement';
import OptionSet from '../metaData/OptionSet/OptionSet';
import Option from '../metaData/OptionSet/Option';

import { convertOptionSetValue } from '../converters/serverToClient';
import isNonEmptyArray from '../utils/isNonEmptyArray';
import errorCreator from '../utils/errorCreator';

type D2Translation = {
    property: string,
    locale: string,
    value: string
};

type D2DataElement = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: Array<D2Translation>,
    description: string,
    optionSetValue: boolean,
    optionSet: { id: string }
};

type D2ProgramStageDataElement = {
    compulsory: boolean,
    displayInReports: boolean,
    dataElement: D2DataElement
};

type D2SectionDataElements = {
    id: string
};

type D2ProgramStageSection = {
    id: string,
    displayName: string,
    dataElements: ?Array<D2SectionDataElements>
};

type D2ProgramStage = {
    id: string,
    displayName: string,
    description: ?string,
    programStageSections: ?Array<D2ProgramStageSection>,
    programStageDataElements: ?Array<D2ProgramStageDataElement>
};

type D2Program = {
    id: string,
    displayName: string,
    displayShortName: string,
    programStages: Array<D2ProgramStage>,
    programType: string,
};

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<D2SectionDataElements>
};

type D2ProgramStageDataElementsAsObject = {
    [id: string]: D2ProgramStageDataElement
};

type D2Option = {
    id: string,
    code: string,
    displayName: string
};

type D2OptionSet = {
    id: string,
    valueType: string,
    options: Array<D2Option>
};

let currentLocale: ?string;
let currentD2OptionSets: ?Array<D2OptionSet>;

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

function buildOptionSet(id: string, dataElement: DataElement) {
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

    return new OptionSet(options, dataElement, null, convertOptionSetValue);
}

function getDataElementTranslation(d2DataElement: D2DataElement, property: $Values<typeof propertyNames>) {
    return currentLocale && d2DataElement.translations[currentLocale] && d2DataElement.translations[currentLocale][property];
}

function buildDataElement(d2ProgramStageDataElement: D2ProgramStageDataElement) {
    const d2DataElement = d2ProgramStageDataElement.dataElement;

    const dataElement = new DataElement((_this) => {
        _this.id = d2DataElement.id;
        _this.name = getDataElementTranslation(d2DataElement, propertyNames.NAME) || d2DataElement.displayName;
        _this.shortName = getDataElementTranslation(d2DataElement, propertyNames.SHORT_NAME) || d2DataElement.displayShortName;
        _this.formName = getDataElementTranslation(d2DataElement, propertyNames.FORM_NAME) || d2DataElement.displayFormName;
        _this.description = getDataElementTranslation(d2DataElement, propertyNames.DESCRIPTION) || d2DataElement.description;
        _this.visible = true; // d2ProgramStageDataElement.displayInReports;
        _this.compulsory = d2ProgramStageDataElement.compulsory;
        _this.disabled = false;
        _this.type = getDataElementType(d2DataElement.valueType);
    });

    if (d2DataElement.optionSet && d2DataElement.optionSet.id) {
        dataElement.optionSet = buildOptionSet(d2DataElement.optionSet.id, dataElement);
    }

    return dataElement;
}

function convertProgramStageDataElementsToObject(d2ProgramStageDataElements: ?Array<D2ProgramStageDataElement>): D2ProgramStageDataElementsAsObject {
    if (!d2ProgramStageDataElements) {
        return {};
    }

    return d2ProgramStageDataElements.reduce((accObject, d2ProgramStageDataElement) => {
        accObject[d2ProgramStageDataElement.dataElement.id] = d2ProgramStageDataElement;
        return accObject;
    }, {});
}

function buildSection(d2ProgramStageDataElements: D2ProgramStageDataElementsAsObject, sectionSpecs: SectionSpecs) {
    const section = new Section((_this) => {
        _this.id = sectionSpecs.id;
        _this.name = sectionSpecs.displayName;
    });

    if (sectionSpecs.dataElements) {
        sectionSpecs.dataElements.forEach((sectionDataElement: D2SectionDataElements) => {
            const id = sectionDataElement.id;
            const d2ProgramStageDataElement = d2ProgramStageDataElements[id];
            section.addElement(buildDataElement(d2ProgramStageDataElement));
        });
    }

    return section;
}

function buildMainSection(d2ProgramStageDataElements: ?Array<D2ProgramStageDataElement>) {
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

function buildStage(d2ProgramStage: D2ProgramStage) {
    const stage = new RenderFoundation((_this) => {
        _this.id = d2ProgramStage.id;
        _this.name = d2ProgramStage.displayName;
        _this.description = d2ProgramStage.description;
    });

    if (isNonEmptyArray(d2ProgramStage.programStageSections)) {
        const d2ProgramStageDataElementsAsObject = convertProgramStageDataElementsToObject(d2ProgramStage.programStageDataElements);
        // $FlowSuppress
        d2ProgramStage.programStageSections.forEach((section: D2ProgramStageSection) => {
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

function buildProgram(d2Program: D2Program) {
    let program;
    if (d2Program.programType === 'WITHOUT_REGISTRATION') {
        program = new EventProgram((_this) => {
            _this.id = d2Program.id;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
        });
        const d2Stage = d2Program.programStages && d2Program.programStages[0];
        program.stage = buildStage(d2Stage);
    } else {
        program = new TrackerProgram((_this) => {
            _this.id = d2Program.id;
            _this.name = d2Program.displayName;
            _this.shortName = d2Program.displayShortName;
        });

        d2Program.programStages.forEach((d2ProgramStage: D2ProgramStage) => {
            program.addStage(buildStage(d2ProgramStage));
        });
    }
    return program;
}

function addProgramVariables(d2ProgramRulesVariables: Array<ProgramRuleVariable>) {
    const rulesVariablesByProgram = d2ProgramRulesVariables.reduce((accRulesVariablesByProgram, d2RuleVariable) => {
        const ruleVariableProgramId = d2RuleVariable.program.id;
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
        const ruleProgramId = d2Rule.program.id;
        accRulesByProgram[ruleProgramId] = accRulesByProgram[ruleProgramId] || [];
        accRulesByProgram[ruleProgramId].push(d2Rule);
        return accRulesByProgram;
    }, {});

    Object.keys(rulesByProgram).forEach((programKey) => {
        const programRules = rulesByProgram[programKey];
        const program = programCollection.get(programKey);
        if (program) {
            program.programRules = programRules;
        }
    });
}

export default function buildProgramCollection(
    d2Programs: ?Array<D2Program>,
    d2OptionSets: ?Array<D2OptionSet>,
    d2ProgramRulesVariables: ?Array<ProgramRuleVariable>,
    d2ProgramRules: ?Array<ProgramRule>,
    locale: ?string) {
    currentLocale = locale;
    currentD2OptionSets = d2OptionSets;

    if (d2Programs) {
        d2Programs.forEach((d2Program) => {
            const program = buildProgram(d2Program);
            programCollection.set(program.id, program);
        });

        if (d2ProgramRulesVariables) {
            addProgramVariables(d2ProgramRulesVariables);
        }

        if (d2ProgramRules) {
            addProgramRules(d2ProgramRules);
        }
    }
}
