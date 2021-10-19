// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import { DateField } from 'capture-core/components/FormFields/New';
import { InfoBox } from '../InfoBox';
import type { Props } from './scheduleDate.types';

const styles = {
    container: {
        display: 'flex',
        marginTop: spacersNum.dp4,
    },
    button: {
        paddingRight: spacersNum.dp16,
    },
};

const ScheduleDatePlain = ({
    scheduleDate,
    setScheduleDate,
    orgUnit,
    suggestedScheduleDate,
    eventCountInOrgUnit,
    classes,
}: Props) => (<>
    <div className={classes.container}>
        <DateField
            value={moment(scheduleDate).format('YYYY-MM-DD')}
            calendarMinMoment={moment()}
            width="100%"
            calendarWidth={350}
            onSetFocus={() => {}}
            onFocus={() => { }}
            onRemoveFocus={() => { }}
            onBlur={(e) => { setScheduleDate(e); }}
        />
    </div>
    <InfoBox
        scheduleDate={scheduleDate}
        suggestedScheduleDate={suggestedScheduleDate}
        eventCountInOrgUnit={eventCountInOrgUnit}
        orgUnitName={orgUnit?.name}
    />
</>);

export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
