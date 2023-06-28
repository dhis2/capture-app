// @flow
import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, spacers } from '@dhis2/ui';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import type { Props } from './scheduleButtons.types';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';

const styles = {
    container: {
        display: 'flex',
        gap: spacers.dp8,
    },
    button: {
    },
};

const ScheduleButtonsPlain = ({ hasChanges, onSchedule, onCancel, classes }: Props) => {
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const handleCancelClick = () => {
        if (hasChanges) { setCancelDialogVisible(true); } else { onCancel(); }
    };
    return (<div className={classes.container}>
        <div className={classes.button}>
            <Button
                onClick={onSchedule}
                primary
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

export const ScheduleButtons: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleButtonsPlain));
