// @flow
import type { AvailableSearchOptions } from '../SearchPage.types';

export type OwnProps = {|
  +availableSearchOptions: AvailableSearchOptions,
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
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +searchStatus: string,
  +isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string)=> boolean,
|}

export type DispatchersFromRedux = {|
  onSearchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  onSearchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  onSearchViaAttributesOnScopeProgram: ({| programId: string, formId: string |}) => void,
  onSearchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

