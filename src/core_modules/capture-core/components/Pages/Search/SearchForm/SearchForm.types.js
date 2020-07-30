// @flow
import type { SearchGroup } from '../SearchPage.types';

export type CurrentSearchTerms = Array<{|
  +name: string,
  +value: string,
  +id: string,
|}>

export type OwnProps = {|
  +searchGroupForSelectedScope: SearchGroup,
  +selectedSearchScopeId: ?string,
|}

export type PropsFromRedux ={|
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +searchStatus: string,
  +isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string)=> boolean,
  +currentSearchTerms: CurrentSearchTerms
|}

export type DispatchersFromRedux = {|
  searchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page?: string |}) => void,
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  saveCurrentFormData: (searchScopeType: string, searchScopeId: string, formId: string, currentSearchTerms: CurrentSearchTerms) => void,
|}

export type Props = {|
  ...CssClasses,
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

