// @flow
import React, { type ComponentType, useState, useMemo } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { useScheduleDate } from './useScheduleDate';
import { DateField } from 'capture-core/components/FormFields/New';

const styles = {
    container: {
        display: 'flex',
        marginTop: spacersNum.dp4,
    },
    button: {
        paddingRight: spacersNum.dp16,
    },
};

const ScheduleDatePlain = ({ programId, stageId, classes }: Props) => {
    const [scheduleDate, setScheduleDate] = useState();
    const { programStageSchedule } = useScheduleDate(stageId);
    console.log({ programStageSchedule });
    return (<div className={classes.container}>
        <DateField
            value={scheduleDate}
            calendarMinMoment={moment()}
            width="100%"
            calendarWidth={350}
            onSetFocus={() => {}}
            onFocus={() => { }}
            onRemoveFocus={() => { }}
            onBlur={(e) => { setScheduleDate(e); }}
        />
    </div>);
};

export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
