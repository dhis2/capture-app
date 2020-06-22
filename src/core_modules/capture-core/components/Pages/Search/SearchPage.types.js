// @flow
import { SearchGroup } from '../../../metaData/SearchGroup';

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
  programs: {
    [elementId: string]: {|
      +programId: string,
      +programName: string,
      +searchGroups: Array<SearchGroup>
    |}
  }
}

export type Props =
  PropsFromRedux & {
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
  |},
}
