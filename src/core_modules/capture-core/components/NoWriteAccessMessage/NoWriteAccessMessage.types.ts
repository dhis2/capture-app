import { WithStyles } from '@material-ui/core';

export type NoWriteAccessMessageProps = {
    title?: string;
    message: string;
};

export type NoWriteAccessMessagePlainProps = NoWriteAccessMessageProps & WithStyles<typeof styles>;

export const styles = () => ({
    header: {
        flexGrow: 1,
        fontSize: 16,
        fontWeight: 500,
    },
    message: {
        marginTop: 10,
    },
});
