// @flow

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
    description: string,
    translations: Array<CachedAttributeTranslation>,
    unique: ?boolean,
    valueType: string,
    optionSetValue: boolean,
    optionSet: { id: string },
}

export type CachedProgramTrackedEntityAttribute = {
    trackedEntityAttribute: CachedTrackedEntityAttribute,
    displayInList: ?boolean,
    searchable: ?boolean,
    mandatory: ?boolean,
    renderOptionsAsRadio: ?boolean,
}

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
    translations: Array<CachedDataElementTranslation>,
    description: string,
    optionSetValue: boolean,
    optionSet: { id: string },
    style: CachedStyle,
};

export type CachedProgramStageDataElement = {
    compulsory: boolean,
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
    featureType: string,
    validationStrategy: string,
};

export type CachedCategoryOption = {
    id: string,
    displayName: string,
};

export type CachedCategory = {
    id: string,
    displayName: string,
    categoryOptions: ?Array<CachedCategoryOption>,
};

export type CachedCategoryCombo = {
    id: string,
    displayName: string,
    categories: ?Array<CachedCategory>,
    isDefault: boolean,
};

export type CachedProgramTrackedEntityType = {
    id: string,
    displayName: string,
}

export type CachedProgram = {
    id: string,
    access: Object,
    displayName: string,
    displayShortName: string,
    organisationUnits: Array<Object>,
    programStages: Array<CachedProgramStage>,
    programType: string,
    categoryCombo: ?CachedCategoryCombo,
    style?: ?CachedStyle,
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityType: ?CachedProgramTrackedEntityType,
    incidentDateLabel: ?string,
    enrollmentDateLabel: ?string,
    dataEntryForm: ?CachedDataEntryForm,
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

export type CachedOptionSet = {
    id: string,
    valueType: string,
    options: Array<CachedOption>,
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
