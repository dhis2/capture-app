// @flow

import React, { type Element } from 'react';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

type Props = {|
    icon: Element<any>,
    label: string,
    onClickAction: () => void,
    dataTest?: string,
    ...CssClasses,
|}

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, classes }: Props) => (
    <Button
        onClick={() => onClickAction()}
        dataTest={dataTest}
    >
        <div className={classes.button}>
            {icon}
            {label}
        </div>
    </Button>
);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
