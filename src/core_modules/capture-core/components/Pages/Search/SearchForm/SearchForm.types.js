// @flow
import type { SearchGroups } from '../SearchPage.types';

export type CurrentSearchTerms = Array<{|
  +name: string,
  +value: string,
  +id: string,
|}>

export type FormsValues = {
    [formIdentifier: string]: {
      [formElement: string]: Object
    }
  }

export type OwnProps = {|
  +searchGroupsForSelectedScope: SearchGroups,
  +selectedSearchScopeId?: string,
  +classes: Object,
|}

export type PropsFromRedux ={|
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +formsValues: FormsValues,
  +searchStatus: string,
  +isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string)=> boolean,
|}

export type DispatchersFromRedux = {|
  searchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page?: string |}) => void,
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  saveCurrentFormData: (searchScopeType: string, searchScopeId: string, formId: string, currentSearchTerms: CurrentSearchTerms) => void,
  addFormIdToReduxStore: (formId: string) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

