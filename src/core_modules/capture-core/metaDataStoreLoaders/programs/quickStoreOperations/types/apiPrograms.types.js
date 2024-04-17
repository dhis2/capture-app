// @flow

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
    categories?: ?Array<apiProgramCategory>,
};

type apiStyle = {
    color?: ?string,
    icon?: ?string,
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
    sortOrder: Number,
    dataElements?: ?Array<{ id: string }>,
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
    trackedEntityAttributes: Array<{ id: string }>
}

type apiOption = {
    code: string,
    name: string
}
type apiOptionSet = {
    id: string,
    options?: ?Array<apiOption>
}

type apiDataElement = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    valueType: string,
    translations: Array<apiTranslation>,
    description?: ?string,
    optionSetValue: boolean,
    style: apiStyle,
    optionSet: apiOptionSet,
};

export type apiProgramStageDataElement = {
    compulsory: boolean,
    displayInReports: boolean,
    renderOptionsAsRadio: boolean,
    renderType: Object,
    dataElement: apiDataElement,
};

export type apiProgramStage = {
    id: string,
    access: apiAccess,
    displayName: string,
    description?: ?string,
    displayExecutionDateLabel?: ?string,
    displayDueDateLabel?: ?string,
    formType: string,
    featureType: string,
    validationStrategy: string,
    enableUserAssignment: boolean,
    dataEntryForm?: ?apiDataEntryForm,
    programStageSections?: ?Array<apiProgramStageSections>,
    programStageDataElements?: ?Array<apiProgramStageDataElement>,
    hideDueDate?: boolean,
    repeatable?: boolean
};

export type apiProgramTrackedEntityAttribute = {
    trackedEntityAttribute: {
        id: string,
        displayName?: ?string,
        optionSet?: ?apiOptionSet
    },
    displayInList: boolean,
    searchable: boolean,
    mandatory: boolean,
    renderOptionsAsRadio: boolean,
};

type apiProgram = {
    id: string,
    version: number,
    displayName: string,
    displayShortName: string,
    description?: ?string,
    programType: string,
    style?: ?apiStyle,
    minAttributesRequiredToSearch: number,
    displayEnrollmentDateLabel?: ?string,
    displayIncidentDateLabel?: ?string,
    featureType?: ?string,
    selectEnrollmentDatesInFuture: boolean,
    displayFrontPageList: boolean,
    useFirstStageDuringRegistration: boolean,
    selectIncidentDatesInFuture: boolean,
    displayIncidentDate: boolean,
    dataEntryForm?: ?apiDataEntryForm,
    access: apiAccess,
    trackedEntityType?: ?{ id: string },
    categoryCombo: apiProgramCategoryCombo,
    organisationUnits?: ?Array<apiProgramOrganisationUnit>,
    userRoles?: ?Array<apiProgramUserRoles>,
    programStages?: ?Array<apiProgramStage>,
    programSections?: ?Array<apiProgramSections>,
    programTrackedEntityAttributes?: ?Array<apiProgramTrackedEntityAttribute>,
};

export type apiProgramsResponse = {
    programs?: ?Array<apiProgram>,
    pager?: ?Object,
};
