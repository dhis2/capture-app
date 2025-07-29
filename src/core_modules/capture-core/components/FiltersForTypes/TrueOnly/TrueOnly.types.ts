import type { WithStyles } from '@material-ui/core/styles';

export type Value = Array<any> | null | undefined;

export type PlainProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
};

export type Props = PlainProps & WithStyles<typeof import('./TrueOnlyFilter.component').getStyles>;
