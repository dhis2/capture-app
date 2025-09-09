import type { WithStyles } from '@material-ui/core';
import type { CardDataElementsInformation } from '../../SearchBox';
import type { ListItem, RenderCustomCardActions } from '../../CardList/CardList.types';

export type OwnProps = {
    renderCardActions?: RenderCustomCardActions;
    selectedScopeId: string;
    dataEntryId: string;
};

export type PropsFromRedux = {
    ready: boolean;
    isUpdating: boolean;
    error?: string;
    teis: Array<ListItem>;
    dataElements: CardDataElementsInformation;
};

export type Props = OwnProps & PropsFromRedux & WithStyles<any>;
