// @flow
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';
import { typeof searchScopes } from '../SearchPage.constants';
import { typeof dataElementTypes } from '../../../../metaData';
import type { AvailableSearchOption } from '../SearchPage.types';
import type { ListItem } from '../../../CardList/CardList.types';


export type CardDataElementsInformation = Array<{| id: string, name: string, type: $Values<dataElementTypes> |}>

export type CardProfileImageElementInformation = $ReadOnly<{| id: string, name: string, type: "IMAGE" |}>

export type PropsFromRedux ={|
  +currentPage: number,
  +currentSearchScopeType: $Keys<searchScopes>,
  +currentSearchScopeId: string,
  +currentSearchScopeName: string,
  +currentFormId: string,
  +searchResults: Array<ListItem>,
  +currentSearchTerms: CurrentSearchTerms,
  +dataElements: CardDataElementsInformation,
  +otherResults: Array<ListItem>,
  +otherCurrentPage: number,
|}

export type OwnProps ={|
    fallbackTriggered: boolean,
    availableSearchOptions: ?AvailableSearchOption,
|}

export type DispatchersFromRedux = {|
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string, page: string, resultsPageSize: number |}) => void,
  startFallbackSearch: ({| programId: string, formId: string, resultsPageSize: number, page?: ?number |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page: string, resultsPageSize: number |}) => void,
  handleCreateNew: () => void
|}

export type Props = {|
  ...DispatchersFromRedux,
  ...PropsFromRedux,
  ...OwnProps,
  ...CssClasses
|}

