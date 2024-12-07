// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import {
    DateField,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
} from 'capture-core/components/FormFields/New';

import type { Props } from './scheduleDate.types';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { InfoBox } from '../InfoBox';
import { convertStringToDateFormat } from '../../../utils/converters/date';



const LabelledRequiredDateField = withDefaultFieldContainer()(
    withLabel({
        onGetCustomFieldLabeClass: () => labelTypeClasses.dateLabel,
    })(
        withDisplayMessages()(
            withInternalChangeHandler()(
                DateField,
            ),
        ),
    ),
);

const styles = {
    container: {
        display: 'flex',
        marginTop: spacersNum.dp4,
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
        <LabelledRequiredDateField
            label={i18n.t('Schedule date / Due date')}
            required
            value={scheduleDate}
            width="100%"
            calendarWidth={350}
            onSetFocus={() => { }}
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
