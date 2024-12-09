// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacers } from '@dhis2/ui';
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
import { baseInputStyles } from '../ScheduleOrgUnit/commonProps';


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
    infoBox: {
        padding: `0 ${spacers.dp24} ${spacers.dp24} ${spacers.dp16}`,
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
}: Props) => (
    <>
        {!hideDueDate && (
            <>
                <LabelledRequiredDateField
                    label={i18n.t('Schedule date / Due date')}
                    required
                    value={scheduleDate}
                    width="100%"
                    calendarWidth={350}
                    styles={baseInputStyles}
                    onSetFocus={() => { }}
                    onFocus={() => { }}
                    onRemoveFocus={() => { }}
                    onBlur={(e) => { setScheduleDate(convertStringToDateFormat(e)); }}
                />
                <div className={classes.infoBox}>
                    <InfoBox
                        scheduleDate={serverScheduleDate}
                        suggestedScheduleDate={serverSuggestedScheduleDate}
                        eventCountInOrgUnit={eventCountInOrgUnit}
                        orgUnitName={orgUnit?.name}
                        hideDueDate={hideDueDate}
                    />
                </div>
            </>
        )}
    </>
);


export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
