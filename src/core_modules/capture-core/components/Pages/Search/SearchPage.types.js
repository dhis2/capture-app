// @flow
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

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
  +availableSearchOptions: {
    [elementId: string]: {|
      +searchOptionId: string,
      +searchOptionName: string,
      +searchGroups: Array<{|searchForm: RenderFoundation, unique: boolean, formId: string, searchScope: string|}>
    |}
  },
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +error: boolean,
  +ready: boolean,
  +searchStatus: string,
|}

export type DispatchersFromRedux = {|
  onScopeProgramFindUsingUniqueIdentifier: ({| programId: string, formId: string |}) => void,
  onScopeTrackedEntityTypeFindUsingUniqueIdentifier: ({| trackedEntityTypeId: string, formId: string |}) => void,
  addFormIdToReduxStore: (formId: string) => void,
  closeModal: () => void
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

