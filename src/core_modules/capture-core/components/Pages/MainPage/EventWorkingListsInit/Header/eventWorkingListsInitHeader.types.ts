import type { ReactNode } from 'react';
import type { WithStyles } from '@material-ui/core/styles';

export type Props = {
    children: ReactNode;
} & WithStyles<any>;
