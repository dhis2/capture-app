// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    DateField,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
} from 'capture-core/components/FormFields/New';
import { isValidDate } from 'capture-core/utils/validation/validators/form';
import { hasValue } from 'capture-core-utils/validators/form';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { InfoBox } from '../InfoBox';
import { baseInputStyles } from '../ScheduleOrgUnit/commonProps';
import type { Props } from './scheduleDate.types';
import { isValidPeriod } from '../../../../capture-core-utils/validators/form';

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
    programExpiryPeriodType,
    programExpiryDays,
}: Props) => {
    const validateDate = (dateString, internalComponentError) => {
        if (!hasValue(dateString)) {
            return {
                error: true,
                validationText: i18n.t('A value is required'),
            };
        }

        const dateValidation = isValidDate(dateString, internalComponentError);
        if (!programExpiryPeriodType || !programExpiryDays) {
            return {
                error: false,
                validationText: '',
            };
        }
        const { isValid: validPeriod, firstValidDate } = isValidPeriod(dateString, {
            programExpiryPeriodType,
            programExpiryDays,
        });
        if (!dateValidation.valid) {
            return {
                error: true,
                validationText: dateValidation.errorMessage || i18n.t('Please provide a valid date'),
            };
        }
        if (!validPeriod) {
            return {
                error: true,
                validationText: i18n.t('The date entered belongs to an expired period. Enter a date after {{firstValidDate}}', {
                    firstValidDate,
                    interpolation: { escapeValue: false },
                }),
            };
        }

        return {
            error: false,
            validationText: '',
        };
    };
    return (
        <div className={classes.fieldWrapper}>
            {!hideDueDate ?
                <ScheduleDateField
                    label={i18n.t('Schedule date / Due date')}
                    required
                    value={scheduleDate}
                    width="100%"
                    calendarWidth={350}
                    styles={baseInputStyles}
                    onSetFocus={() => { }}
                    onFocus={() => { }}
                    onRemoveFocus={() => { }}
                    onBlur={(date, internalComponentError) => {
                        setScheduleDate(date);
                        setValidation(validateDate(date, internalComponentError));
                    }}
                    calendarType={systemSettingsStore.get().calendar}
                    dateFormat={systemSettingsStore.get().dateFormat}
                    validation={validation}
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
};


export const ScheduleDate: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(ScheduleDatePlain));
