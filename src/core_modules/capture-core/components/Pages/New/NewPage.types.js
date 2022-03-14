// @flow
import { typeof newPageStatuses } from './NewPage.constants';

type ProgramCategories = Array<{|name: string, id: string|}>

export type ContainerProps = $ReadOnly<{|
  showMessageToSelectOrgUnitOnNewPage: ()=>void,
  showMessageToSelectProgramCategoryOnNewPage: ()=>void,
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
|}
>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}

