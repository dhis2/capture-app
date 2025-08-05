import type { WithStyles } from '@material-ui/core';

export type PlainProps = {
    label: string;
    checked: boolean;
    disabled?: boolean;
    id: string;
    onChange: (status: string) => void;
    dataTest?: string;
};

export type Props = PlainProps & WithStyles<any>;
