// @flow

import { type Access } from '../metaData/Access';

type Translation = {
    property: string,
    locale: string,
    value: string,
};

export type CachedAttributeValue = { attribute: { id: string }, value: any };

export type CachedOptionTranslation = Translation;

export type CachedOptionSetTranslation = Translation;

export type CachedAttributeTranslation = Translation;

export type CachedTrackedEntityAttribute = {
    id: string,
    displayName: string,
    code: string,
    displayShortName: string,
    displayFormName: string,
    description: string,
    translations: Array<CachedAttributeTranslation>,
    valueType: string,
    optionSetValue: boolean,
    inherit: boolean,
    optionSet: { id: string },
    unique: ?boolean,
    orgunitScope: ?boolean,
    pattern: ?string,
    attributeValues: Array<CachedAttributeValue>
}

export type CachedProgramTrackedEntityAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    searchable: boolean,
    mandatory: boolean,
    renderOptionsAsRadio: ?boolean,
    allowFutureDate?: ?boolean,
};

export type CachedDataElementTranslation = {
    property: string,
    locale: string,
    value: string
};

export type CachedStyle = {
    color?: ?string,
    icon?: ?string,
};

export type CachedDataElement = {
    id: string,
    displayName: string,
    code: string,
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: { [locale: string]: { [propertyName: string]: string }},
    description: string,
    optionSetValue: boolean,
    optionSet: { id: string },
    style: CachedStyle,
    url: string,
    attributeValues: Array<CachedAttributeValue>
};

export type CachedProgramStageDataElement = {
    compulsory: boolean,
    allowFutureDate?: ?boolean,
    displayInReports: boolean,
    renderOptionsAsRadio?: ?boolean,
    renderType: {
        DESKTOP: {
            type: string,
        },
    },
    dataElementId: string,
};

export type CachedSectionDataElements = {
    id: string
};

export type CachedProgramStageSection = {
    id: string,
    displayName: string,
    displayDescription: string,
    dataElements: ?Array<CachedSectionDataElements>
};

export type CachedDataEntryForm = {
    id: string,
    htmlCode: string,
};

export type CachedProgramStage = {
    id: string,
    access: Object,
    blockEntryForm: boolean,
    name: string,
    displayName: string,
    description: ?string,
    displayExecutionDateLabel?: ?string,
    displayDueDateLabel?: ?string,
    programStageSections: ?Array<CachedProgramStageSection>,
    programStageDataElements: Array<CachedProgramStageDataElement>,
    formType: string,
    dataEntryForm: ?CachedDataEntryForm,
    featureType: ?string,
    validationStrategy: string,
    enableUserAssignment?: ?boolean,
    autoGenerateEvent?: ?boolean,
    allowGenerateNextVisit?: ?boolean,
    remindCompleted?: ?boolean,
    openAfterEnrollment?: ?boolean,
    generatedByEnrollmentDate?: ?boolean,
    hideDueDate?: ?boolean,
    reportDateToUse: string,
    repeatable: boolean,
    minDaysFromStart: number,
    style?: ?CachedStyle,
};

export type CachedCategoryOption = {
    id: string,
    displayName: string,
    organisationUnitIds: ?Array<string>,
    access: Object,
};

export type CachedCategory = {
    id: string,
    displayName: string,
};

export type CachedCategoryOptionsByCategory = {
    id: string,
    options: Array<CachedCategoryOption>,
};

export type ProgramCachedCategory = {
    id: string,
};

export type ProgramCachedCategoryCombo = {
    id: string,
    displayName: string,
    categories: ?Array<ProgramCachedCategory>,
    isDefault: boolean,
};

export type CachedTrackedEntityTypeAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    mandatory: boolean,
    searchable: boolean,
    renderOptionsAsRadio: ?boolean,
};

export type CachedTrackedEntityTypeTranslation = {
    property: string,
    locale: string,
    value: string,
};
export type CachedProgramSection = {
    id: string,
    displayFormName: string,
    sortOrder: number,
    trackedEntityAttributes: Array<string>,
    displayDescription: string
}

export type CachedTrackedEntityType = {
    id: string,
    access: Access,
    displayName: string,
    trackedEntityTypeAttributes: ?Array<CachedTrackedEntityTypeAttribute>,
    translations: Array<CachedTrackedEntityTypeTranslation>,
    minAttributesRequiredToSearch: number,
    featureType: ?string,
}

export type CachedProgram = {
    id: string,
    access: Access,
    displayName: string,
    displayShortName: string,
    organisationUnits: Object,
    programSections: ?Array<CachedProgramSection>,
    programStages: Array<CachedProgramStage>,
    programType: string,
    categoryCombo: ?ProgramCachedCategoryCombo,
    style?: ?CachedStyle,
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityTypeId: ?string,
    incidentDateLabel: ?string,
    enrollmentDateLabel: ?string,
    displayEnrollmentDateLabel: string,
    displayIncidentDateLabel: string,
    dataEntryForm: ?CachedDataEntryForm,
    featureType: ?string,
    selectEnrollmentDatesInFuture: boolean,
    displayFrontPageList: boolean,
    selectIncidentDatesInFuture: boolean,
    displayIncidentDate: boolean,
    onlyEnrollOnce: boolean,
    useFirstStageDuringRegistration: boolean,
};

export type CachedProgramStageDataElementsAsObject = {
    [id: string]: CachedProgramStageDataElement
};

export type CachedOption = {
    id: string,
    code: string,
    displayName: string,
    style?: ?CachedStyle,
    translations: Array<CachedOptionTranslation>,
    attributeValues: Array<CachedAttributeValue>,
};

export type CachedOptionGroup = {
    id: string,
    displayName: string,
    options: Array<string>,
}

export type CachedOptionSet = {
    id: string,
    displayName: string,
    code: string,
    valueType: string,
    options: Array<CachedOption>,
    optionGroups: Array<CachedOptionGroup>,
    translations: Array<CachedOptionSetTranslation>,
    attributeValues: Array<CachedAttributeValue>,
};

export type CachedRelationshipConstraint = {
    relationshipEntity: string,
    trackedEntityType?: ?{ id: string },
    program?: ?{ id: string },
    programStage?: ?{ id: string },
}

export type CachedRelationshipType = {
    id: string,
    displayName: string,
    access: Object,
    fromConstraint: CachedRelationshipConstraint,
    toConstraint: CachedRelationshipConstraint,
}

export type CachedRelationshipTypes = Array<CachedRelationshipType>;
