// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, spacersNum } from '@dhis2/ui';
import type { Props } from './scheduleButtons.types';

const styles = {
    container: {
        display: 'flex',
    },
    button: {
        paddingRight: spacersNum.dp16,
    },
};

const ScheduleButtonsPlain = ({ onSchedule, onCancel, classes }: Props) => (
    <div className={classes.container}>
        <div className={classes.button}>
            <Button
                onClick={() => onSchedule()}
                primary
            >
                {i18n.t('Schedule')}
            </Button>
        </div>
        <div className={classes.button}>
            <Button
                onClick={() => onCancel()}
            >
                {i18n.t('Cancel')}
            </Button>
        </div>
    </div>
);

export const ScheduleButtons: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleButtonsPlain));
