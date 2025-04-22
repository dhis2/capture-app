// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { type Props } from './Actions.types';

const styles = {
    container: {
        display: 'flex',
    },
};

const ActionsPlain = ({ customActionsContents = [], classes }: Props & CssClasses) => (
    <div className={classes.container}> {customActionsContents} </div>
);

export const Actions: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ActionsPlain);
