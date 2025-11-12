import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

type Props = QuickActionButtonTypes & WithStyles<typeof styles>;

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disabled = false, classes }: Props) => (
    <ConditionalTooltip
        content={i18n.t('No available program stages')}
        enabled={disabled}
    >
        <Button
            onClick={onClickAction}
            dataTest={dataTest}
            disabled={disabled}
        >
            <div className={classes.button}>
                {icon}
                {label}
            </div>
        </Button>
    </ConditionalTooltip>);

export const QuickActionButton =
    withStyles(styles)(QuickActionButtonPlain) as ComponentType<QuickActionButtonTypes>;
