// @flow
import type {
    CardDataElementsInformation,
    SearchResultItem,
} from '../../Pages/Search/SearchResults/SearchResults.types';

export type OwnProps = {|
    onLink?: (id: string, values: any)=>void,
    selectedScopeId: string,
    dataEntryId: string,
    selectedScopeId: string
|}

type PropsFromRedux = {|
    ready: boolean,
    isUpdating: boolean,
    error: ?string,
    teis: Array<SearchResultItem>,
    dataElements: CardDataElementsInformation,
|}

export type Props = {| ...OwnProps, ...PropsFromRedux, ...CssClasses |}
