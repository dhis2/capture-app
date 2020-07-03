// @flow
export type PropsFromRedux = {|
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
  +error: boolean,
  +ready: boolean,
|}

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
  |},
|}

export type Props = PropsFromRedux & OwnProps
