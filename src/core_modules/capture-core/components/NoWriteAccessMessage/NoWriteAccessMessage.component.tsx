import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';

const styles = () => ({
    header: {
        flexGrow: 1,
        fontSize: 16,
        fontWeight: 500,
    },
    message: {
        marginTop: 10,
    },
});

type Props = {
    title?: string;
    message: string;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

export const NoWriteAccessMessagePlain = ({ title, message, classes }: PropsWithStyles) => (
    <>
        <div className={classes.header}>
            {title}
        </div>
        <div className={classes.message}>
            <IncompleteSelectionsMessage>
                {message}
            </IncompleteSelectionsMessage>
        </div>
    </>
);

export const NoWriteAccessMessage =
  withStyles(styles)(NoWriteAccessMessagePlain) as ComponentType<Props>;
