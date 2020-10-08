// @flow
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';
import { typeof searchScopes } from '../SearchPage.constants';
import { typeof dataElementTypes } from '../../../../metaData';

export type CardDataElementsInformation = Array<{| id: string, name: string, type: $Values<dataElementTypes> |}>

export type CardProfileImageElementInformation = $ReadOnly<{| id: string, name: string, type: "IMAGE" |}>

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
  +currentPage: number,
  +currentSearchScopeType: $Keys<searchScopes>,
  +currentSearchScopeId: string,
  +currentSearchScopeName: string,
  +currentFormId: string,
  +searchResults: Array<SearchResultItem>,
  +currentSearchTerms: CurrentSearchTerms,
  +dataElements: CardDataElementsInformation
|}

export type DispatchersFromRedux = {|
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string, page: string, resultsPageSize: number |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page: string, resultsPageSize: number |}) => void,
|}

export type Props = {|
  ...DispatchersFromRedux,
  ...PropsFromRedux,
|}

