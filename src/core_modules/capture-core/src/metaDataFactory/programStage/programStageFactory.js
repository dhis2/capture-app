// @flow
import log from 'loglevel';
import type {
    CachedProgramStageDataElement,
    CachedSectionDataElements,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,
    CachedRelationshipType,
    CachedRelationshipConstraint,

} from '../cache.types';
import errorCreator from '../../utils/errorCreator';
import Section from '../../metaData/RenderFoundation/Section';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import CustomForm from '../../metaData/RenderFoundation/CustomForm';
import capitalizeFirstLetter from '../../utils/string/capitalizeFirstLetter';
import isNonEmptyArray from '../../utils/isNonEmptyArray';
import ProgramStage from '../../metaData/Program/ProgramStage';
import getCamelCaseUppercaseString from '../getCamelCaseUppercaseString';
import buildDataElement from './dataElementFactory';
import RelationshipType from '../../metaData/RelationshipType/RelationshipType';

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
};

let currentLocale: ?string;
let currentD2OptionSets: ?Array<CachedOptionSet>;
let currentStageId: string;
let currentProgramId: string;

const relationshipEntityName = 'PROGRAM_STAGE_INSTANCE';
const CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

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
            section.addElement(await buildDataElement(d2ProgramStageDataElement, currentD2OptionSets, currentLocale));
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
            section.addElement(await buildDataElement(d2ProgramStageDataElement, currentD2OptionSets, currentLocale));
        }));
    }

    return section;
}

function convertProgramStageDataElementsToObject(
    d2ProgramStageDataElements: ?Array<CachedProgramStageDataElement>): CachedProgramStageDataElementsAsObject {
    if (!d2ProgramStageDataElements) {
        return {};
    }

    return d2ProgramStageDataElements.reduce((accObject, d2ProgramStageDataElement) => {
        accObject[d2ProgramStageDataElement.dataElement.id] = d2ProgramStageDataElement;
        return accObject;
    }, {});
}

function getFeatureType(d2ProgramStage: CachedProgramStage) {
    return d2ProgramStage.featureType ?
        capitalizeFirstLetter(d2ProgramStage.featureType.toLowerCase())
        :
        'None';
}


function relationshipConstraintIsStage(constraint: CachedRelationshipConstraint) {
    return (
        constraint.relationshipEntity === relationshipEntityName &&
        (
            (
                !constraint.programStage &&
                constraint.program &&
                constraint.program.id === currentProgramId
            ) ||
            (
                constraint.programStage &&
                constraint.programStage.id === currentStageId
            )
        )
    );
}

function convertConstraint(constraint: CachedRelationshipConstraint) {
    const convertedConstraint = {
        entity: constraint.relationshipEntity,
        programId: constraint.program ? constraint.program.id : null,
        programStageId: constraint.programStage ? constraint.programStage.id : null,
        trackedEntityTypeId: constraint.trackedEntityType ? constraint.trackedEntityType.id : null,
    };
    if (!convertConstraint.programStageId && relationshipConstraintIsStage(constraint)) {
        convertConstraint.programStageId = currentStageId;
    }
    return convertedConstraint;
}

function buildRelationshipType(d2RelationshipType: CachedRelationshipType) {
    return new RelationshipType((_this) => {
        _this.id = d2RelationshipType.id;
        _this.displayName = d2RelationshipType.displayName;
        _this.from = convertConstraint(d2RelationshipType.fromConstraint);
        _this.to = convertConstraint(d2RelationshipType.toConstraint);
        _this.access = d2RelationshipType.access;
    });
}

function buildRelationshipTypes(d2RelationshipTypes: ?Array<CachedRelationshipType>) {
    const filteredRelationshipTypes = d2RelationshipTypes ?
        d2RelationshipTypes.filter(rt =>
            relationshipConstraintIsStage(rt.fromConstraint) ||
            relationshipConstraintIsStage(rt.toConstraint),
        ) : [];

    return filteredRelationshipTypes.map(rt => buildRelationshipType(rt));
}

export default async function buildStage(
    d2ProgramStage: CachedProgramStage,
    d2OptionSets: ?Array<CachedOptionSet>,
    d2RelationshipTypes: ?Array<CachedRelationshipType>,
    programId: string,
    locale: ?string) {
    currentD2OptionSets = d2OptionSets;
    currentLocale = locale;
    currentStageId = d2ProgramStage.id;
    currentProgramId = programId;
    const stage = new ProgramStage((_stage) => {
        _stage.id = d2ProgramStage.id;
        _stage.relationshipTypes = buildRelationshipTypes(d2RelationshipTypes);
        _stage.stageForm = new RenderFoundation((_form) => {
            _form.id = d2ProgramStage.id;
            _form.name = d2ProgramStage.displayName;
            _form.description = d2ProgramStage.description;
            _form.featureType = getFeatureType(d2ProgramStage);
            _form.access = d2ProgramStage.access;
            _form.addLabel({ id: 'eventDate', label: d2ProgramStage.executionDateLabel || 'Incident date' });
            _form.validationStrategy =
                d2ProgramStage.validationStrategy && getCamelCaseUppercaseString(d2ProgramStage.validationStrategy);
        });
    });

    const stageForm = stage.stageForm;

    if (d2ProgramStage.formType === 'CUSTOM' && d2ProgramStage.dataEntryForm) {
        const section = await buildMainSection(d2ProgramStage.programStageDataElements);
        section.showContainer = false;
        stageForm.addSection(section);
        const dataEntryForm = d2ProgramStage.dataEntryForm;
        try {
            stageForm.customForm = new CustomForm((_this) => {
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
            stageForm.addSection(await buildSection(d2ProgramStageDataElementsAsObject, {
                id: section.id,
                displayName: section.displayName,
                dataElements: section.dataElements,
            }));
        });
    } else {
        stageForm.addSection(await buildMainSection(d2ProgramStage.programStageDataElements));
    }

    return stage;
}
