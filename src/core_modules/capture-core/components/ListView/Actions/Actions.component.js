// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { type Props } from './Actions.types';

const styles = {
    container: {
        display: 'flex',
    },
};

const ActionsPlain = ({ customTopBarActions = [], classes }: Props & CssClasses) => (
    <div className={classes.container}>
        {customTopBarActions.map(({ key, actionContents }) => (
            <React.Fragment key={key}>
                {actionContents}
            </React.Fragment>
        ))}
    </div>
);

export const Actions: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ActionsPlain);
