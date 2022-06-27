// @flow
import type { RenderFoundation } from '../../../metaData';

export type SearchGroups = Array<{|
  +searchForm: RenderFoundation,
  +unique: boolean,
  +formId: string,
  +searchScope: string,
  +minAttributesRequiredToSearch: number
|}>

export type SelectedSearchScopeId = ?string

export type AvailableSearchOptions = $ReadOnly<{
    [elementId: string]: {|
      +searchOptionId: string,
      +searchOptionName: string,
      +TETypeName: ?string,
      +searchGroups: SearchGroups |}
  }>

export type ContainerProps = $ReadOnly<{|
  cleanSearchRelatedInfo: ()=>void,
  navigateToMainPage: ()=>void,
  showInitialSearchPage: ()=>void,
  navigateToRegisterUser: ()=>void,
  trackedEntityTypeId: string,
  availableSearchOptions: AvailableSearchOptions,
  preselectedProgramId: SelectedSearchScopeId,
  minAttributesRequiredToSearch: number,
  searchableFields: Array<Object>,
  searchStatus: string,
  error: boolean,
  ready: boolean,
  programId: string,
  orgUnitId: string,
|}
>

export type Props = {|
  ...CssClasses,
  ...ContainerProps
|}

