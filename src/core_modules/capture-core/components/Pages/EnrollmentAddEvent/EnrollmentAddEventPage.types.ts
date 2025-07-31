import type { WithStyles } from '@material-ui/core';

export type PlainProps = Record<string, never>;

export type Props = PlainProps & WithStyles<any>;
