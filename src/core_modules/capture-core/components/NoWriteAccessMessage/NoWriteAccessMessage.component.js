// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { InefficientSelectionsMessage } from '../InefficientSelectionsMessage';

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

type Props = {|
    title: string,
    message: string,
    ...CssClasses
|}
export const NoWriteAccessMessagePlain: ComponentType<Props> = ({ title, message, classes }) => (
    <>
        <div className={classes.header}>
            {title}
        </div>
        <div className={classes.message}>
            <InefficientSelectionsMessage message={message} />
        </div>
    </>
);

export const NoWriteAccessMessage: ComponentType<$Diff<Props, CssClasses>> =
  withStyles(styles)(NoWriteAccessMessagePlain);
