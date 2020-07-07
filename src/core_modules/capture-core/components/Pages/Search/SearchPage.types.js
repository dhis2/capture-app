// @flow
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';


export type AvailableSearchOptions = {
  [elementId: string]: {|
    +searchOptionId: string,
    +searchOptionName: string,
    +searchGroups: Array<{|
      +searchForm: RenderFoundation,
      +unique: boolean,
      +formId: string,
      +searchScope: string,
      +minAttributesRequiredToSearch: number
    |}>
  |}
}
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
  |},
|}

export type PropsFromRedux ={|
  +preselectedProgram: {|
    value: ?string,
    label: ?string
  |},
  +trackedEntityTypesWithCorrelatedPrograms: {
    [elementId: string]: {|
      +trackedEntityTypeId: string,
      +trackedEntityTypeName: string,
      +programs: Array<{|
        +programName: string,
        +programId: string,
      |}>
    |}
  },
  +availableSearchOptions: AvailableSearchOptions,
  +error: boolean,
  +ready: boolean,
  +searchStatus: string,
  +generalPurposeErrorMessage: string,
  +searchResults: Array<{|
    +id: string,
    +tei: Object,
    +values: Object
  |}>,
|}

export type DispatchersFromRedux = {|
  addFormIdToReduxStore: (formId: string) => void,
  closeModal: () => void,
  navigateToMainPage: () => void
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

