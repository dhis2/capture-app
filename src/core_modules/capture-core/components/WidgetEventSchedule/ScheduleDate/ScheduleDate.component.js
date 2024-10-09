// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateField } from 'capture-core/components/FormFields/New';
import { InfoBox } from '../InfoBox';
import type { Props } from './scheduleDate.types';
import { convertStringToDateFormat } from '../../../utils/converters/date';


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
    serverScheduleDate,
    setScheduleDate,
    orgUnit,
    serverSuggestedScheduleDate,
    eventCountInOrgUnit,
    classes,
    hideDueDate,
}: Props) => (<>
    {!hideDueDate && <div className={classes.container}>
        <DateField
            value={scheduleDate}
            width="100%"
            calendarWidth={350}
            onSetFocus={() => {}}
            onFocus={() => { }}
            onRemoveFocus={() => { }}
            onBlur={(e) => { setScheduleDate(convertStringToDateFormat(e)); }}
        />
    </div>}
    <InfoBox
        scheduleDate={serverScheduleDate}
        suggestedScheduleDate={serverSuggestedScheduleDate}
        eventCountInOrgUnit={eventCountInOrgUnit}
        orgUnitName={orgUnit?.name}
        hideDueDate={hideDueDate}
    />
</>);

export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
