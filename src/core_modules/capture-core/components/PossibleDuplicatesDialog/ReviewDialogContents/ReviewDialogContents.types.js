// @flow
import type { CardDataElementsInformation } from '../../SearchBox';
import type { ListItem, RenderCustomCardActions } from '../../CardList/CardList.types';

export type OwnProps = {|
    renderCardActions?: RenderCustomCardActions,
    selectedScopeId: string,
    dataEntryId: string,
    selectedScopeId: string
|}

type PropsFromRedux = {|
    ready: boolean,
    isUpdating: boolean,
    error: ?string,
    teis: Array<ListItem>,
    dataElements: CardDataElementsInformation,
|}

export type Props = {| ...OwnProps, ...PropsFromRedux, ...CssClasses |}
