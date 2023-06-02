// @flow
import type { SearchGroups } from '../SearchBox.types';
import { typeof dataElementTypes } from '../../../metaData';

export type CurrentSearchTerms = Array<{|
  +name: string,
  +value: any,
  +id: string,
  +type: $Values<dataElementTypes>
|}>

export type FormsValues = {
    [formIdentifier: string]: {
      [formElement: string]: Object
    }
  }

export type OwnProps = {|
  +searchGroupsForSelectedScope: SearchGroups,
  +selectedSearchScopeId: ?string,
  +fallbackTriggered: boolean,
|}

export type PropsFromRedux ={|
  +keptFallbackSearchFormValues: FormsValues,
  +formsValues: FormsValues,
  +searchStatus: string,
  +isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string)=> boolean,
  +isSearchViaUniqueIdValid: (formId: string)=> boolean,
|}

export type DispatchersFromRedux = {|
  searchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  searchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, resultsPageSize: number |}) => void,
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string, resultsPageSize: number |}) => void,
  saveCurrentFormData: ({| searchScopeType: string, searchScopeId: string, formId: string, formsValues: FormsValues, searchGroupsForSelectedScope: SearchGroups |}) => void,
  removeFormDataFromReduxStore: () => void,
  addFormIdToReduxStore: (formId: string, keptFallbackSearchFormValues: FormsValues) => void,
  showUniqueSearchValueEmptyModal: ({ uniqueTEAName: string }) => void
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
  ...CssClasses
|}

