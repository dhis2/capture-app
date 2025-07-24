import type { WithStyles } from '@material-ui/core/styles';

export type Props = {
    description: string;
};

export type PlainProps = Props & WithStyles<any>;
