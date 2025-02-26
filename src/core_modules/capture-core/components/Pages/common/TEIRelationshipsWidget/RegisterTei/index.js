// @flow
export { RegisterTei } from './RegisterTei.container';
export { actionTypes } from './registerTei.actions';
export { actionTypes as registrationSectionActionTypes } from './RegistrationSection';
export { actionTypes as dataEntryActionTypes } from './DataEntry/RegisterTeiDataEntry.actions';
export {
    actionTypes as searchGroupDuplicateActionTypes,
} from '../../../../PossibleDuplicatesDialog/possibleDuplicatesDialog.actions';
export {
    loadSearchGroupDuplicatesForReviewEpic,
} from '../../../../PossibleDuplicatesDialog/possibleDuplicatesDialog.epics';
export { getRelationshipNewTeiName } from './exposedHelpers/getRelationshipNewTeiName';
