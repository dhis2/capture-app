// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import isDefined from 'd2-utilizr/lib/isDefined';
import Model from 'd2/lib/model/Model';

import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

function sort(arr: Array<any>, key: string = 'sortOrder') {
    arr.sort((a, b) => {
        const mainSortField = key;

        if (!isDefined(a[mainSortField])) {
            return 1;
        } else if (!isDefined(b[mainSortField])) {
            return -1;
        }

        return a[mainSortField] - b[mainSortField];
    });
    return arr;
}

function convertFromCollectionToArray(collection) {
    if (!collection || collection.size === 0) {
        return [];
    }
    return [...collection.toArray()];
}

function getSectionDataElements(d2dataElementCollection) {
    const d2DataElements = convertFromCollectionToArray(d2dataElementCollection);
    return d2DataElements.map(d2DataElement => ({
        id: d2DataElement.id,
    }));
}

function getProgramStageSections(d2SectionsCollection) {
    const d2Sections = convertFromCollectionToArray(d2SectionsCollection);
    const sections = d2Sections.map(section => ({
        id: section.id,
        displayName: section.displayName,
        sortOrder: section.sortOrder,
        dataElements: getSectionDataElements(section.dataElements),
    }));

    sort(sections);

    return sections;
}

function convertTranslationsToObject(translations) {
    if (!translations) {
        return [];
    }

    return translations.reduce((accTranslationObject, translation) => {
        if (!accTranslationObject[translation.locale]) {
            accTranslationObject[translation.locale] = {};
        }
        accTranslationObject[translation.locale][translation.property] = translation.value;
        return accTranslationObject;
    }, {});
}

function getProgramStageDataElements(programStageDataElements) {
    return programStageDataElements
        .filter(programStageDataElement => programStageDataElement.dataElement)
        .map((programStageDataElement) => {
            programStageDataElement.dataElement.translations =
                convertTranslationsToObject(programStageDataElement.dataElement.translations);
            return programStageDataElement;
        });
}

function getProgramStages(d2ProgramStagesCollection) {
    const d2ProgramStages = convertFromCollectionToArray(d2ProgramStagesCollection);

    const programStages = d2ProgramStages.map((d2ProgramStage) => {
        const programStage = { ...d2ProgramStage.dataValues };
        programStage.programStageDataElements = getProgramStageDataElements(programStage.programStageDataElements);
        programStage.programStageSections = getProgramStageSections(programStage.programStageSections);
        programStage.notificationTemplates =
            convertFromCollectionToArray(programStage.notificationTemplates).map(template => ({
                id: template.id,
            }));
        return programStage;
    });

    sort(programStages);

    return programStages;
}

function getOrganisationUnits(d2OrganisationUnitsCollection) {
    const d2OrganisationUnits = convertFromCollectionToArray(d2OrganisationUnitsCollection);
    return d2OrganisationUnits.reduce((accOrganisationUnits, organisationUnit) => {
        accOrganisationUnits[organisationUnit.id] = {
            id: organisationUnit.id,
            name: organisationUnit.name,
            displayName: organisationUnit.displayName,
        };
        return accOrganisationUnits;
    }, {});
}

function getProgramTrackedEntityAttribute(programAttribute) {
    const { trackedEntityAttribute, ...attribute } = programAttribute;
    const trackedEntityAttributeId = trackedEntityAttribute && trackedEntityAttribute.id;
    if (!trackedEntityAttributeId) {
        log.error(
            errorCreator('encountered a programAttribute without a trackedEntityAttributeId')({ programAttribute }),
        );
    }

    return {
        ...attribute,
        trackedEntityAttributeId,
    };
}

function getProgramTrackedEntityAttributes(attributes) {
    return attributes ?
        attributes
            .map(pa => getProgramTrackedEntityAttribute(pa))
            .filter(pa => pa) : null;
}

export default new ApiSpecification((_this) => {
    _this.modelName = 'programs';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields:
            '*,' +
            'dataEntryForm[*],' +
            'access[*],' +
            'relatedProgram[id,displayName],' +
            'relationshipType[id,displayName],' +
            'trackedEntityType[id],' +
            'categoryCombo[id,displayName,isDefault,categories[id,displayName]]' +
            'organisationUnits[id,displayName],' +
            'userRoles[id,displayName],' +
            'programStages[*,dataEntryForm[*],programStageSections[id,displayName,description,sortOrder,dataElements[id]],programStageDataElements[*,dataElement[*,optionSet[id]]]],' +
            'programTrackedEntityAttributes[*]',
    };
    _this.converter = (d2Programs) => {
        if (!d2Programs || d2Programs.length === 0) {
            return null;
        }

        const programs = d2Programs.map((d2Program: Model) => ({
            id: d2Program.id,
            access: d2Program.access,
            name: d2Program.name,
            displayName: d2Program.displayName,
            displayShortName: d2Program.displayShortName,
            created: d2Program.created,
            description: d2Program.displayDescription,
            version: d2Program.version,
            categoryCombo: d2Program.categoryCombo,
            programStages: getProgramStages(d2Program.programStages),
            organisationUnits: getOrganisationUnits(d2Program.organisationUnits),
            programType: d2Program.programType,
            style: d2Program.style,
            trackedEntityTypeId: d2Program.trackedEntityType && d2Program.trackedEntityType.id,
            programTrackedEntityAttributes: getProgramTrackedEntityAttributes(d2Program.programTrackedEntityAttributes),
            minAttributesRequiredToSearch: d2Program.minAttributesRequiredToSearch,
            enrollmentDateLabel: d2Program.enrollmentDateLabel,
            incidentDateLabel: d2Program.incidentDateLabel,
            dataEntryForm: d2Program.dataEntryForm,
            featureType: d2Program.featureType,
            selectEnrollmentDatesInFuture: d2Program.selectEnrollmentDatesInFuture,
            selectIncidentDatesInFuture: d2Program.selectIncidentDatesInFuture,
            displayIncidentDate: d2Program.displayIncidentDate,
        }));

        return programs;
    };
});

