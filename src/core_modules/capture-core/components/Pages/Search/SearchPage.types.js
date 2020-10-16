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
      +searchGroups: SearchGroups |}
  }>

export type TrackedEntityTypesWithCorrelatedPrograms = $ReadOnly<{
  [elementId: string]: {|
    +trackedEntityTypeId: string,
    +trackedEntityTypeName: string,
    +programs: Array<{|
      +programName: string,
      +programId: string,
    |}>
  |}
}>

export type ContainerProps = $ReadOnly<{|
  navigateToMainPage: ()=>void,
  showInitialSearchPage: ()=>void,
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  availableSearchOptions: AvailableSearchOptions,
  preselectedProgramId: SelectedSearchScopeId,
  searchStatus: string,
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  ...CssClasses,
  ...ContainerProps
|}

