// @flow
export { RegisterTei } from './RegisterTei.container';
export { openNewRelationshipRegisterTeiEpic } from './open.epics';
export { actionTypes } from './registerTei.actions';
export { actionTypes as registrationSectionActionTypes } from './RegistrationSection';
export { actionTypes as dataEntryActionTypes } from './DataEntry/RegisterTeiDataEntry.actions';
export {
    actionTypes as searchGroupDuplicateActionTypes,
} from './GeneralOutput/WarningsSection/SearchGroupDuplicate/searchGroupDuplicate.actions';
export {
    loadSearchGroupDuplicatesForReviewEpic,
} from './GeneralOutput/WarningsSection/SearchGroupDuplicate/searchGroupDuplicate.epics';
export { default as getRelationshipNewTei } from './exposedHelpers/getRelationshipNewTei';
