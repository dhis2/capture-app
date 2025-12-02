type apiDataAccess = {
    read: boolean,
    write: boolean,
};

type apiAccess = {
    data: apiDataAccess,
    read: boolean,
    update: boolean,
    delete: boolean,
    write: boolean,
    manage: boolean,
};

type apiProgramCategory = {
    id: string,
    displayName: string,
};

type apiProgramCategoryCombo = {
    id: string,
    displayName: string,
    isDefault: boolean,
    categories?: Array<apiProgramCategory> | null,
};

type apiStyle = {
    color?: string | null,
    icon?: string | null,
};

type apiDataEntryForm = {
    id: string,
    htmlCode: string,
};

type apiProgramOrganisationUnit = {
    id: string,
    displayName: string,
};

type apiProgramUserRoles = {
    id: string,
    displayName: string,
};

type apiProgramStageSections = {
    id: string,
    displayName: string,
    sortOrder: number,
    dataElements?: Array<{ id: string }> | null,
};

type apiTranslation = {
    property: string,
    locale: string,
    value: string,
};

type apiProgramSections = {
    id: string,
    sortOrder: number,
    displayFormName: string,
    trackedEntityAttributes: Array<{ id: string }>,
    description: string | null
}

type apiOption = {
    code: string,
    name: string
}
type apiOptionSet = {
    id: string,
    options?: Array<apiOption> | null
}

type apiDataElement = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: Array<apiTranslation>,
    description?: string | null,
    optionSetValue: boolean,
    style: apiStyle,
    optionSet: apiOptionSet,
};

export type apiProgramStageDataElement = {
    compulsory: boolean,
    displayInReports: boolean,
    renderOptionsAsRadio: boolean,
    renderType: any,
    dataElement: apiDataElement,
};

export type apiProgramStage = {
    id: string,
    access: apiAccess,
    displayName: string,
    description?: string | null,
    displayExecutionDateLabel?: string | null,
    displayDueDateLabel?: string | null,
    formType: string,
    featureType: string,
    validationStrategy: string,
    enableUserAssignment: boolean,
    dataEntryForm?: apiDataEntryForm | null,
    programStageSections?: Array<apiProgramStageSections> | null
    programStageDataElements?: Array<apiProgramStageDataElement> | null,
    hideDueDate?: boolean,
    repeatable?: boolean
};

export type apiProgramTrackedEntityAttribute = {
    trackedEntityAttribute: {
        id: string,
        displayName?: string | null,
        optionSet?: apiOptionSet | null
    },
    displayInList: boolean,
    searchable: boolean,
    mandatory: boolean,
    renderOptionsAsRadio: boolean,
    preferredSearchOperator?: string,
    blockedSearchOperators?: Array<string>
};

type apiProgram = {
    id: string,
    version: number,
    displayName: string,
    displayShortName: string,
    description?: string | null,
    programType: string,
    style?: apiStyle | null,
    minAttributesRequiredToSearch: number,
    displayEnrollmentDateLabel?: string | null,
    displayIncidentDateLabel?: string | null,
    featureType?: string | null,
    selectEnrollmentDatesInFuture: boolean,
    displayFrontPageList: boolean,
    useFirstStageDuringRegistration: boolean,
    selectIncidentDatesInFuture: boolean,
    displayIncidentDate: boolean,
    dataEntryForm?: apiDataEntryForm | null,
    access: apiAccess,
    trackedEntityType?: { id: string } | null,
    categoryCombo: apiProgramCategoryCombo,
    organisationUnits?: Array<apiProgramOrganisationUnit> | null,
    userRoles?: Array<apiProgramUserRoles> | null,
    programStages?: Array<apiProgramStage> | null,
    programSections?: Array<apiProgramSections> | null,
    programTrackedEntityAttributes?: Array<apiProgramTrackedEntityAttribute> | null,
};

export type apiProgramsResponse = {
    programs?: Array<apiProgram> | null,
    pager?: any | null,
};
