// @flow
import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, spacersNum } from '@dhis2/ui';
import { ConfirmDialog } from '../../Dialogs/ConfirmDialog.component';
import type { Props } from './scheduleButtons.types';
import { defaultDialogProps } from '../../Dialogs/ConfirmDialog.constants';

const styles = {
    container: {
        display: 'flex',
    },
    button: {
        paddingRight: spacersNum.dp16,
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
            >
                {i18n.t('Cancel')}
            </Button>
        </div>
        <ConfirmDialog
            {...defaultDialogProps}
            onDestroy={onCancel}
            open={cancelDialogVisible}
            onCancel={() => { setCancelDialogVisible(false); }}
        />
    </div>);
};

export const ScheduleButtons: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleButtonsPlain));
