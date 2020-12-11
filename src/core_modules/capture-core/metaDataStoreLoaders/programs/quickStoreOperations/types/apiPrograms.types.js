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
  optionSet: { id: string },
};

type apiProgramStageDataElement = {
  compulsory: boolean,
  displayInReports: boolean,
  renderOptionsAsRadio: boolean,
  renderType: Object,
  dataElement: apiDataElement,
};

type apiProgramStage = {
  id: string,
  access: apiAccess,
  displayName: string,
  description?: ?string,
  executionDateLabel?: ?string,
  formType: string,
  featureType: string,
  validationStrategy: string,
  enableUserAssignment: boolean,
  dataEntryForm?: ?apiDataEntryForm,
  programStageSections?: ?Array<apiProgramStageSections>,
  programStageDataElements?: ?Array<apiProgramStageDataElement>,
};

type apiProgramTrackedEntityAttribute = {
  trackedEntityAttribute: { id: string },
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
  enrollmentDateLabel?: ?string,
  incidentDateLabel?: ?string,
  featureType?: ?string,
  selectEnrollmentDatesInFuture: boolean,
  selectIncidentDatesInFuture: boolean,
  displayIncidentDate: boolean,
  dataEntryForm?: ?apiDataEntryForm,
  access: apiAccess,
  trackedEntityType?: ?{ id: string },
  categoryCombo: apiProgramCategoryCombo,
  organisationUnits?: ?Array<apiProgramOrganisationUnit>,
  userRoles?: ?Array<apiProgramUserRoles>,
  programStages?: ?Array<apiProgramStage>,
  programTrackedEntityAttributes?: ?Array<apiProgramTrackedEntityAttribute>,
};

export type apiProgramsResponse = {
  programs?: ?Array<apiProgram>,
  pager?: ?Object,
};
