import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';
import { Button, spacers } from '@dhis2/ui';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import type { PlainProps } from './ScheduleButtons.types';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';

const styles = {
    container: {
        display: 'flex',
        gap: spacers.dp8,
    },
    button: {
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const ScheduleButtonsPlain = ({ hasChanges, onSchedule, onCancel, classes, validation }: Props) => {
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const handleCancelClick = () => {
        if (hasChanges) { setCancelDialogVisible(true); } else { onCancel(); }
    };
    return (<div className={classes.container}>
        <div className={classes.button}>
            <Button
                onClick={onSchedule}
                primary
                disabled={validation?.error}
            >
                {i18n.t('Schedule')}
            </Button>
        </div>
        <div className={classes.button}>
            <Button
                onClick={handleCancelClick}
                secondary
            >
                {i18n.t('Cancel')}
            </Button>
        </div>
        <DiscardDialog
            {...defaultDialogProps}
            onDestroy={onCancel}
            open={cancelDialogVisible}
            onCancel={() => { setCancelDialogVisible(false); }}
        />
    </div>);
};

export const ScheduleButtons = withStyles(styles)(ScheduleButtonsPlain) as ComponentType<PlainProps>;
