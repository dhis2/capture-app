import type { Access } from '../../metaData/Access';

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
    unique?: boolean | null,
    orgunitScope?: boolean | null,
    pattern?: string | null,
    attributeValues: Array<CachedAttributeValue>
}

export type CachedProgramTrackedEntityAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    searchable: boolean,
    mandatory: boolean,
    renderOptionsAsRadio?: boolean | null,
    allowFutureDate?: boolean,
};

export type CachedDataElementTranslation = {
    property: string,
    locale: string,
    value: string
};

export type CachedStyle = {
    color?: string | null,
    icon?: string | null,
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
    allowFutureDate?: boolean,
    displayInReports: boolean,
    renderOptionsAsRadio?: boolean | null,
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
    dataElements: Array<CachedSectionDataElements> | null
};

export type CachedDataEntryForm = {
    id: string,
    htmlCode: string,
};

export type CachedProgramStage = {
    id: string,
    access: any,
    blockEntryForm: boolean,
    name: string,
    displayName: string,
    description: string | null,
    displayExecutionDateLabel?: string | null,
    displayDueDateLabel?: string | null,
    programStageSections?: Array<CachedProgramStageSection> | null,
    programStageDataElements: Array<CachedProgramStageDataElement>,
    formType: string,
    dataEntryForm?: CachedDataEntryForm | null,
    featureType?: 'POINT' | 'POLYGON' | null,
    validationStrategy: string,
    enableUserAssignment?: boolean | null,
    autoGenerateEvent?: boolean | null,
    allowGenerateNextVisit?: boolean | null,
    remindCompleted?: boolean | null,
    openAfterEnrollment?: boolean | null,
    generatedByEnrollmentDate?: boolean | null,
    hideDueDate?: boolean | null,
    reportDateToUse: string,
    repeatable: boolean,
    minDaysFromStart: number,
    style?: CachedStyle | null,
};

export type CachedCategoryOption = {
    id: string,
    displayName: string,
    organisationUnitIds?: Array<string> | null,
    access: any,
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
    categories: Array<ProgramCachedCategory> | null,
    isDefault: boolean,
};

export type CachedTrackedEntityTypeAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    mandatory: boolean,
    searchable: boolean,
    renderOptionsAsRadio?: boolean | null,
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
    trackedEntityTypeAttributes?: Array<CachedTrackedEntityTypeAttribute> | null,
    translations: Array<CachedTrackedEntityTypeTranslation>,
    minAttributesRequiredToSearch: number,
    featureType: 'POINT' | 'POLYGON' | null,
}

export type CachedProgram = {
    id: string,
    access: Access,
    displayName: string,
    displayShortName: string,
    organisationUnits: any,
    programSections?: Array<CachedProgramSection> | null,
    programStages: Array<CachedProgramStage>,
    programType: string,
    categoryCombo: ProgramCachedCategoryCombo | null,
    style?: CachedStyle | null,
    minAttributesRequiredToSearch: number,
    programTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityTypeAttributes: Array<any>,
    trackedEntityTypeId?: string | null,
    incidentDateLabel?: string | null,
    enrollmentDateLabel?: string | null,
    displayEnrollmentDateLabel: string,
    displayIncidentDateLabel: string,
    dataEntryForm?: CachedDataEntryForm | null,
    featureType: 'POINT' | 'POLYGON' | null,
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
    style?: CachedStyle | null,
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
    trackedEntityType?: { id: string } | null,
    program?: { id: string } | null,
    programStage?: { id: string } | null,
}

export type CachedRelationshipType = {
    id: string,
    displayName: string,
    access: any,
    fromConstraint: CachedRelationshipConstraint,
    toConstraint: CachedRelationshipConstraint,
}

export type CachedRelationshipTypes = Array<CachedRelationshipType>;
