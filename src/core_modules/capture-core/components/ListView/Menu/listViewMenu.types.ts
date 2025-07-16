import type { WithStyles } from '@material-ui/core';
import type { CustomMenuContents } from '../types';

export type Props = {
    customMenuContents?: CustomMenuContents;
} & WithStyles<any>;
