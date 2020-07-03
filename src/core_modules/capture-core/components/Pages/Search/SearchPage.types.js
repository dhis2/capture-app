// @flow
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

export type PropsFromRedux = {
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
  +programs: {
    [elementId: string]: {|
      +programId: string,
      +programName: string,
      +searchGroups: Array<{|searchForm: RenderFoundation, unique: boolean, formId: string|}>
    |}
  },
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
}

export type DispatchersFromRedux = {|
  findUsingUniqueIdentifier: ({| selectedProgramId: string, formId: string |}) => void,
  addFormIdToReduxStore: (formId: string) => void,
  closeModal: () => void
|}

export type Props =
  DispatchersFromRedux & PropsFromRedux & {
  +searchStatus: "RESULTS_EMPTY" | "SEARCHING" | "",
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
  |},
  }
