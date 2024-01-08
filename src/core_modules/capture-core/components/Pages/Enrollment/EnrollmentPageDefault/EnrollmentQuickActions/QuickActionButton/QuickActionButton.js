// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import type { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disable, classes }: QuickActionButtonTypes) => (
    <ConditionalTooltip
        content={i18n.t('No available program stages')}
        enabled={disable}
    >
        <Button
            onClick={onClickAction}
            dataTest={dataTest}
            disabled={disable}
        >
            <div className={classes.button}>
                {icon}
                {label}
            </div>
        </Button>
    </ConditionalTooltip>);

export const QuickActionButton = withStyles(styles)(QuickActionButtonPlain);
