// @flow
import type { RenderFoundation } from '../../../metaData';

export type SearchGroups = Array<{|
  +searchForm: RenderFoundation,
  +unique: boolean,
  +formId: string,
  +searchScope: string,
  +minAttributesRequiredToSearch: number
|}>

export type SelectedSearchScope = $ReadOnly<{|
  value: ?string,
  label: ?string
|}>

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
  dispatchNavigateToMainPage: ()=>void,
  dispatchShowInitialSearchPage: ()=>void,
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  availableSearchOptions: AvailableSearchOptions,
  preselectedProgram: SelectedSearchScope,
  searchStatus: string,
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  +classes: Object,
  ...ContainerProps
|}

