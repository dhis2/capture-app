// @flow
import type {
    CardDataElementsInformation,
    SearchResultItem,
} from '../../../../../Search/SearchResults/SearchResults.types';

export type OwnProps = {|
    onLink: (id: string, values: any)=>void
|}

type PropsFromRedux = {|
    ready: boolean,
    isUpdating: boolean,
    error: string,
    teis: Array<SearchResultItem>,
    dataElements: CardDataElementsInformation,
|}

export type Props = {| ...OwnProps, ...PropsFromRedux, ...CssClasses |}
