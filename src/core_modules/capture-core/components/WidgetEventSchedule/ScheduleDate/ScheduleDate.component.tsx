import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    DateField,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
} from 'capture-core/components/FormFields/New';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { InfoBox } from '../InfoBox';
import type { PlainProps } from './ScheduleDate.types';
import { validateScheduleDate } from '../validateScheduleDate';

const baseInputStyles = {
    inputContainerStyle: { flexBasis: 150 },
    labelContainerStyle: { flexBasis: 200 },
};

const ScheduleDateField = withDefaultFieldContainer()(
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

const styles: Readonly<any> = {
    infoBox: {
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
    },
    fieldWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    autoScheduledWrapper: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    fieldLabel: {
        color: colors.grey900,
        padding: `${spacers.dp16} ${spacers.dp24} 0 ${spacers.dp16}`,
        fontSize: '14px',
        flexBasis: 200,
        minWidth: '40%',
        boxSizing: 'border-box',
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const ScheduleDatePlain = ({
    scheduleDate,
    validation,
    serverScheduleDate,
    setScheduleDate,
    setValidation,
    orgUnit,
    serverSuggestedScheduleDate,
    displayDueDateLabel,
    eventCountInOrgUnit,
    classes,
    hideDueDate,
    expiryPeriod,
    stageId,
}: Props) => {
    const scheduleDateLabel = i18n.t('Schedule date / Due date');
    const errorMessage = validation?.error ? validation.validationText : undefined;

    return (
        <div className={hideDueDate ? classes.autoScheduledWrapper : classes.fieldWrapper}>
            {!hideDueDate ?
                <ScheduleDateField
                    label={scheduleDateLabel}
                    required
                    value={scheduleDate}
                    width="100%"
                    calendarWidth={350}
                    styles={baseInputStyles}
                    onBlur={(date: string, internalComponentError: any) => {
                        setScheduleDate(date);
                        setValidation(validateScheduleDate(date, expiryPeriod, internalComponentError));
                    }}
                    calendarType={systemSettingsStore.get().calendar}
                    dateFormat={systemSettingsStore.get().dateFormat}
                    errorMessage={errorMessage}
                />
                :
                <div className={classes.fieldLabel}>
                    {displayDueDateLabel ?? scheduleDateLabel}
                </div>
            }
            {serverScheduleDate && serverSuggestedScheduleDate && (
                <div className={classes.infoBox}>
                    <InfoBox
                        scheduleDate={serverScheduleDate}
                        suggestedScheduleDate={serverSuggestedScheduleDate}
                        eventCountInOrgUnit={eventCountInOrgUnit}
                        orgUnitName={orgUnit?.name}
                        hideDueDate={hideDueDate}
                        stageId={stageId}
                    />
                </div>
            )}
        </div>
    );
};

export const ScheduleDate = withStyles(styles)(ScheduleDatePlain) as ComponentType<PlainProps>;
