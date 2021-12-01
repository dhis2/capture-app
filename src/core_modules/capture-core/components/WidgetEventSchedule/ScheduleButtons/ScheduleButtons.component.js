// @flow
import i18n from '@dhis2/d2-i18n';
import { Button, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import React, { type ComponentType, useState } from 'react';
import { ConfirmDialog } from '../../Dialogs/ConfirmDialog.component';
import type { Props } from './scheduleButtons.types';

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
            header={i18n.t('Unsaved changes')}
            text={i18n.t('Leaving this page will discard the changes you made to this event.')}
            confirmText={i18n.t('Yes, discard')}
            cancelText={i18n.t('No, stay here')}
            onConfirm={onCancel}
            open={cancelDialogVisible}
            onCancel={() => { setCancelDialogVisible(false); }}
        />
    </div>);
};

export const ScheduleButtons: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleButtonsPlain));
