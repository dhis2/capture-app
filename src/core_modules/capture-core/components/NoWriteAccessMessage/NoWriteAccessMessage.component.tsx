import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';

const styles = () => ({
    message: {
        marginTop: 10,
    },
});

type Props = {
    message: string;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

const NoWriteAccessMessagePlain = ({ message, classes }: PropsWithStyles) => (
    <div className={classes.message}>
        <IncompleteSelectionsMessage>
            {message}
        </IncompleteSelectionsMessage>
    </div>
);

export const NoWriteAccessMessage =
  withStyles(styles)(NoWriteAccessMessagePlain) as ComponentType<Props>;
