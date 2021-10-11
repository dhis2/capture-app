// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import { DateField } from 'capture-core/components/FormFields/New';
import { useScheduleDateConfig } from './useScheduleDateConfig';
import { useDetermineSuggestedScheduleDate } from './useDetermineSuggestedScheduleDate';
import { useProgramConfig } from './useProgramConfig';
import { useEventsInOrgUnit } from './useEventsInOrgUnit';
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
    stageId, scheduleDate, setScheduleDate, programId, orgUnit, classes, ...passOnProps }: Props) => {
    const { programStageScheduleConfig } = useScheduleDateConfig(stageId);
    const { programConfig } = useProgramConfig(programId);
    const { events } = useEventsInOrgUnit(orgUnit.id);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, ...passOnProps,
    });

    return (<>
        <div className={classes.container}>
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

        </div>
        <InfoBox
            scheduleDate={scheduleDate}
            suggestedScheduleDate={suggestedScheduleDate}
            eventCountInOrgUnit={events.filter(event => moment(event.dueDate).format('YYYY-MM-DD') === scheduleDate).length}
            orgUnitName={orgUnit?.name}
        />
    </>
    );
};

export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
