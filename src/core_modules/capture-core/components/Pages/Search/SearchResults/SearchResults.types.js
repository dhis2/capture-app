// @flow
import type { SearchGroup } from '../SearchPage.types';
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';

export type OwnProps = {|
  +searchGroupForSelectedScope: SearchGroup,
|}

export type PropsFromRedux ={|
  +rowsCount: number,
  +currentPage: number,
  +rowsPerPage: number,
  +currentSearchScopeType: string,
  +currentSearchScopeId: string,
  +currentFormId: string,
  +searchResults: Array<{|
    +id: string,
    +tei: Object,
    +values: Object
  |}>,
  +currentSearchTerms: CurrentSearchTerms
|}

export type DispatchersFromRedux = {|
  searchViaAttributesOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string, page?: string |}) => void,
  searchViaAttributesOnScopeProgram: ({| programId: string, formId: string, page?: string |}) => void,
|}

export type Props = {|
  +classes: Object,
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
|}

