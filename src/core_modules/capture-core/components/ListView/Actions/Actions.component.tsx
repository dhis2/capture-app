import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import type { Props } from './Actions.types';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
    },
};

type PlainProps = Props & WithStyles<typeof styles>;

const ActionsPlain = ({ customTopBarActions = [], classes }: PlainProps) => (
    <div className={classes.container}>
        {customTopBarActions.map(({ key, actionContents }) => (
            <React.Fragment key={key}>
                {actionContents}
            </React.Fragment>
        ))}
    </div>
);

export const Actions = withStyles(styles)(ActionsPlain);
