// @flow
export type OwnProps = {|
  +classes: {|
    +searchDomainSelectorSection: string,
    +searchButtonContainer: string,
    +searchRow: string,
    +searchRowSelectElement: string,
  |},
|}

export type PropsFromRedux ={|
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
|}

export type DispatchersFromRedux = {|
  onScopeProgramFindUsingUniqueIdentifier: ({| programId: string, formId: string |}) => void,
  onScopeTrackedEntityTypeFindUsingUniqueIdentifier: ({| trackedEntityTypeId: string, formId: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

