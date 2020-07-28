// @flow
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

export type SearchGroup = Array<{|
  +searchForm: RenderFoundation,
  +unique: boolean,
  +formId: string,
  +searchScope: string,
  +minAttributesRequiredToSearch: number
|}>

export type OwnProps = {|
  +classes: {|
    +container: string,
    +header: string,
    +paper: string,
    +customEmpty: string,
    +groupTitle: string,
    +searchDomainSelectorSection: string,
    +searchRow: string,
    +searchRowTitle: string,
    +searchRowSelectElement: string,
    +searchButtonContainer: string,
    +emptySelectionPaperContainer: string,
    +emptySelectionPaperContent: string,
    +divider: string,
    +generalPurposeErrorMessage: string,
    +backButton: string,
    +pagination: string,
    +loadingMask: string,
    +topSection: string,
  |},
|}

export type PreselectedProgram = $ReadOnly<{|
  value: ?string,
  label: ?string
|}>

export type AvailableSearchOptions = $ReadOnly<{
    [elementId: string]: {|
      +searchOptionId: string,
      +searchOptionName: string,
      +searchGroups: SearchGroup |}
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

export type PropsFromRedux ={|
  +error: boolean,
  +ready: boolean,
|}

export type DispatchersFromRedux = {|
  addFormIdToReduxStore: (formId: string) => void,
  showInitialSearchPage: () => void,
  navigateToMainPage: () => void,
  paginationChange: (newPage: number) => void
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

