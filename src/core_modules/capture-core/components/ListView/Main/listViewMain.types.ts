import type { ReactNode } from 'react';
import type { WithStyles } from '@material-ui/core';
import type { ListViewContextBuilderPassOnProps } from '../ContextBuilder';
import type {
    Columns,
    CustomMenuContents,
    CustomRowMenuContents,
    CustomTopBarActions,
    SetColumnOrder,
    SelectRow,
} from '../types';

type WithFilterPassOnProps = ListViewContextBuilderPassOnProps & {
    filters: ReactNode;
};

type ComponentProps = {
    columns: Columns;
    filters: ReactNode;
    updatingWithDialog?: boolean;
    onSetColumnOrder: SetColumnOrder;
    rowIdKey: string;
    customMenuContents?: CustomMenuContents;
    customRowMenuContents?: CustomRowMenuContents;
    customTopBarActions?: CustomTopBarActions;
    onClickListRow: SelectRow;
    onRowSelect: (id: string) => void;
    onSelectAll: (rows: Array<string>) => void;
    isSelectionInProgress?: boolean;
    bulkActionBarComponent: ReactNode;
} & WithStyles<any>;

type RestProps = Omit<WithFilterPassOnProps, keyof ComponentProps>;

export type Props = RestProps & ComponentProps;
