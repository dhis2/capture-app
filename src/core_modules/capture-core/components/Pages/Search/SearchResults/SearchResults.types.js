// @flow
import type { SearchGroups } from '../SearchPage.types';
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';
import { typeof searchScopes } from '../SearchPage.constants';

export type OwnProps = {|
  +searchGroupsForSelectedScope: SearchGroups,
|}

export type CardDataElementsInformation = Array<{| id: string, name: string |}>

type Tei = $ReadOnly<{
  created: string,
  orgUnit: string,
  trackedEntityInstance: string,
  lastUpdated: string,
  trackedEntityType: string,
  deleted: boolean,
  featureType: string,
  programOwners: Array<any>,
  enrollments: Array<any>,
  relationships: ?Array<any>,
  attributes: Array<{
    lastUpdated: string,
    code: string,
    displayName: string,
    created: string,
    valueType: string,
    attribute: string,
    value: string
  }>
}>

export type SearchResultItem = {|
  +id: string,
  +values: {
    [elementId: string]: any,
  },
  +tei?: Tei,
|}


export type PropsFromRedux ={|
  +rowsCount: number,
  +currentPage: number,
  +rowsPerPage: number,
  +currentSearchScopeType: $Keys<searchScopes>,
  +currentSearchScopeId: string,
  +currentSearchScopeName: string,
  +currentFormId: string,
  +searchResults: Array<SearchResultItem>,
  +currentSearchTerms: CurrentSearchTerms
|}

export type DispatchersFromRedux = {|
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string, page?: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page?: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
|}

