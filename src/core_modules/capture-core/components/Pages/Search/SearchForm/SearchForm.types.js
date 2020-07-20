// @flow
import type { SearchGroup } from '../SearchPage.types';

export type OwnProps = {|
  +searchGroupForSelectedScope: SearchGroup,
  +selectedSearchScopeId?: string,
  +classes: {|
    +searchDomainSelectorSection: string,
    +searchButtonContainer: string,
    +searchRow: string,
    +searchRowSelectElement: string,
    +textInfo: string,
    +textError: string,
  |},
|}

export type PropsFromRedux ={|
  +searchGroupForSelectedScope: SearchGroup,
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +searchStatus: string,
  +isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string)=> boolean,
|}

export type DispatchersFromRedux = {|
  searchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

