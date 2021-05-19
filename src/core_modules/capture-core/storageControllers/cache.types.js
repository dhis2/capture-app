// @flow

import { type Access } from '../metaData/Access';

type Translation = {
    property: string,
    locale: string,
    value: string,
};

export type CachedOptionTranslation = Translation;

export type CachedOptionSetTranslation = Translation;

export type CachedAttributeTranslation = Translation;

export type CachedTrackedEntityAttribute = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    description: string,
    translations: Array<CachedAttributeTranslation>,
    valueType: string,
    optionSetValue: boolean,
    optionSet: { id: string },
    unique: ?boolean,
    orgunitScope: ?boolean,
    pattern: ?string,
}

export type CachedProgramTrackedEntityAttribute = {
    trackedEntityAttributeId: ?string,
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
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: { [locale: string]: { [propertyName: string]: string }},
    description: string,
    optionSetValue: boolean,
    optionSet: { id: string },
    style: CachedStyle,
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
    dataElement: CachedDataElement,
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
    displayName: string,
    description: ?string,
    executionDateLabel?: ?string,
    programStageSections: ?Array<CachedProgramStageSection>,
    programStageDataElements: ?Array<CachedProgramStageDataElement>,
    formType: string,
    dataEntryForm: ?CachedDataEntryForm,
    featureType: ?string,
    validationStrategy: string,
    enableUserAssignment?: ?boolean,
    autoGenerateEvent?: ?boolean,
    openAfterEnrollment?: ?boolean,
    generatedByEnrollmentDate?: ?boolean,
    reportDateToUse: string,
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
    trackedEntityAttributeId: ?string,
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
    programStages: Array<CachedProgramStage>,
    programType: string,
    categoryCombo: ?ProgramCachedCategoryCombo,
    style?: ?CachedStyle,
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityTypeId: ?string,
    incidentDateLabel: ?string,
    enrollmentDateLabel: ?string,
    dataEntryForm: ?CachedDataEntryForm,
    featureType: ?string,
    selectEnrollmentDatesInFuture: boolean,
    selectIncidentDatesInFuture: boolean,
    displayIncidentDate: boolean,
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
};

export type CachedOptionGroup = {
    id: string,
    displayName: string,
    options: Array<string>,
}

export type CachedOptionSet = {
    id: string,
    displayName: string,
    valueType: string,
    options: Array<CachedOption>,
    optionGroups: Array<CachedOptionGroup>,
    translations: Array<CachedOptionSetTranslation>,
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
