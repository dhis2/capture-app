import type { ReactNode } from 'react';
import type { WithStyles } from '@material-ui/core';

export type Props = {
    children: ReactNode;
} & WithStyles<typeof import('./EventWorkingListsInitHeader').styles>;
