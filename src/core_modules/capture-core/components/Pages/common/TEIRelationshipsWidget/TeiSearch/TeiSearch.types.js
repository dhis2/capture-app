// @flow
import { type SearchGroup } from '../../../../../metaData';

type PropsFromRedux = {|
    searchGroups: ?Array<SearchGroup>,
    showResults?: ?boolean,
    openSearchGroupSection: ?string,
    trackedEntityTypeName: string,
    selectedProgramId: ?string,
|}

type DispatchersFromRedux = {|
    onSearch: Function,
    onSearchValidationFailed: Function,
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: ?string) => void,
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void,
    onNewSearch: (searchId: string) => void,
    onEditSearch: (searchId: string) => void,
|}

export type OwnProps = {|
    id: string,
    getResultsView: Function,
    resultsPageSize: number,
    selectedTrackedEntityTypeId: string,
|}

export type Props = {| ...OwnProps, ...DispatchersFromRedux, ...PropsFromRedux, ...CssClasses |}
