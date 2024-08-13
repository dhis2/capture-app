// @flow
import { typeof newPageStatuses } from './NewPage.constants';
import { dataElementTypes } from '../../../metaData';

type ProgramCategories = Array<{|name: string, id: string|}>

type InputAttribute = {
  attribute: string,
  code: string,
  created: string,
  displayName: string,
  lastUpdated: string,
  value: string,
  valueType: $Keys<typeof dataElementTypes>,
};

export type ContainerProps = $ReadOnly<{|
  showMessageToSelectOrgUnitOnNewPage: ()=>void,
  showMessageToSelectProgramCategoryOnNewPage: ()=>void,
  showMessageThatCategoryOptionIsInvalidForOrgUnit: ()=>void,
  categoryOptionIsInvalidForOrgUnit: boolean,
  showDefaultViewOnNewPage: ()=>void,
  handleMainPageNavigation: ()=>void,
  currentScopeId: string,
  orgUnitSelectionIncomplete: boolean,
  programCategorySelectionIncomplete: boolean,
  missingCategoriesInProgramSelection: ProgramCategories,
  newPageStatus: $Keys<newPageStatuses>,
  writeAccess: boolean,
  error: boolean,
  ready: boolean,
  isUserInteractionInProgress: boolean,
  programId?: string,
  teiId?: string,
  trackedEntityName?: string,
  teiDisplayName?: string,
  trackedEntityInstanceAttributes?: Array<InputAttribute>
|}
>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}

