// @flow
export type PropsFromRedux = {
  +preselectedProgram: {
    value: ?string,
    label: ?string
  },
  +trackedEntityTypesWithCorrelatedPrograms: {
    [elementId: string]: {
      +trackedEntityTypeId: string,
      +trackedEntityTypeName: string,
      +programs: Array<{
        +programName: string,
        +programId: string,
        +programIcon: Object
      }>
    }
  }
}

export type Props =
  PropsFromRedux & {
  +classes: {
    +container: string,
    +header: string,
    +dataEntryPaper: string,
    +customEmpty: string,
    +groupTitle: string,
  },
}
