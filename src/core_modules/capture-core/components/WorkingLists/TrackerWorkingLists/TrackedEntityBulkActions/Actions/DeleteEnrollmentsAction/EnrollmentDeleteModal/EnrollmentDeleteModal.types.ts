import type { WithStyles } from '@material-ui/core';

export type PlainProps = {
    selectedRows: Record<string, boolean>;
    programId: string;
    onUpdateList: () => void;
    setIsDeleteDialogOpen: (open: boolean) => void;
};

export type Props = PlainProps & WithStyles<any>;
