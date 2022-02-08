// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { Tooltip, withStyles } from '@material-ui/core';
import type { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disable, classes }: QuickActionButtonTypes) => (
    <Button
        onClick={onClickAction}
        dataTest={dataTest}
        disabled={disable}
    >
        <Tooltip
            title={disable ? i18n.t('No available program stages') : ''}
        >
            <div className={classes.button}>
                {icon}
                {label}
            </div>
        </Tooltip>
    </Button>
);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
