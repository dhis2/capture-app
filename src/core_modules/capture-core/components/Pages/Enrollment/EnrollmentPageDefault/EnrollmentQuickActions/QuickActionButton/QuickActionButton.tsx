import React, { type ComponentType } from 'react';
import { Button, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { useTermLabel } from '../../../../../../metaData';
import { customTerms } from '../../../../../../utils/customTerms';
import { QuickActionButtonTypes } from './QuickActionButton.types';

const styles = {
    button: {
        display: 'flex',
        gap: spacers.dp8,
        alignItems: 'center',
    },
};

type Props = QuickActionButtonTypes & WithStyles<typeof styles>;

const QuickActionButtonPlain = ({ icon, label, onClickAction, dataTest, disabled = false, classes }: Props) => {
    const programStagesLabel = useTermLabel('programStage', { plural: true });
    return (
        <ConditionalTooltip
            content={customTerms.i18n.t('No available {{programStagesLabel}}', { programStagesLabel })}
            enabled={disabled}
        >
            <Button
                onClick={onClickAction}
                dataTest={dataTest}
                disabled={disabled}
                small
            >
                <div className={classes.button}>
                    {icon}
                    {label}
                </div>
            </Button>
        </ConditionalTooltip>);
};

export const QuickActionButton =
    withStyles(styles)(QuickActionButtonPlain) as ComponentType<QuickActionButtonTypes>;
