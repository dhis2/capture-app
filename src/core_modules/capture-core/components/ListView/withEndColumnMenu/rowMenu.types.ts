import type { CustomRowMenuContents, DataSourceItem } from '../types';

export type Props = {
    row: DataSourceItem;
    customRowMenuContents?: CustomRowMenuContents;
};

export type State = {
    menuOpen: boolean | null;
};
