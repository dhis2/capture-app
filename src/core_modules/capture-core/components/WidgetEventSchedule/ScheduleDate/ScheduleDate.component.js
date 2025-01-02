// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacers, colors } from '@dhis2/ui';
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
import { baseInputStyles } from '../ScheduleOrgUnit/commonProps';


const ScheduleDataField = withDefaultFieldContainer()(
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
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    fieldLabel: {
        color: colors.grey900,
        padding: `${spacers.dp16} ${spacers.dp24} 0 ${spacers.dp16}`,
        fontSize: '14px',
    },
};

const ScheduleDatePlain = ({
    scheduleDate,
    serverScheduleDate,
    setScheduleDate,
    orgUnit,
    serverSuggestedScheduleDate,
    displayDueDateLabel,
    eventCountInOrgUnit,
    classes,
    hideDueDate,
}: Props) => (
    <div className={classes.fieldWrapper}>
        {!hideDueDate ?
            <ScheduleDataField
                label={i18n.t('Schedule date / Due date')}
                required
                value={scheduleDate}
                width="100%"
                calendarWidth={350}
                styles={baseInputStyles}
                onSetFocus={() => { }}
                onFocus={() => { }}
                onRemoveFocus={() => { }}
                onBlur={(e, internalComponentError) => {
                    const { error } = internalComponentError;
                    if (error) {
                        setScheduleDate('');
                        return;
                    }
                    setScheduleDate(e);
                }}
            />
            :
            <div className={classes.fieldLabel}>
                {displayDueDateLabel ?? i18n.t('Schedule date / Due date', {
                    interpolation: { escapeValue: false },
                },
                )}
            </div>
        }
        <div className={classes.infoBox}>
            <InfoBox
                scheduleDate={serverScheduleDate}
                suggestedScheduleDate={serverSuggestedScheduleDate}
                eventCountInOrgUnit={eventCountInOrgUnit}
                orgUnitName={orgUnit?.name}
                hideDueDate={hideDueDate}
            />
        </div>
    </div>
);


export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
