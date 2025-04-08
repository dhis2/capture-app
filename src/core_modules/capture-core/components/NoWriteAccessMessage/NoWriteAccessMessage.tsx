import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';
import { styles, type NoWriteAccessMessageProps, type NoWriteAccessMessagePlainProps } from './NoWriteAccessMessage.types';

export const NoWriteAccessMessagePlain = ({ title, message, classes }: NoWriteAccessMessagePlainProps) => (
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
  withStyles(styles)(NoWriteAccessMessagePlain) as ComponentType<NoWriteAccessMessageProps>;
