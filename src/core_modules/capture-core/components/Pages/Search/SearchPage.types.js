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
  |},
|}

export type DispatchersFromRedux = {|
  addFormIdToReduxStore: (formId: string) => void,
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
  +error: boolean,
  +ready: boolean,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

