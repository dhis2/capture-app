// @flow
import React from 'react';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import {
    DateField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from '../../WidgetEnrollmentEventNew/DataEntry/dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import type { ErrorMessagesForReferral } from '../ReferralActions/ReferralActions.types';
import type { ReferralDataValueStates } from '../../WidgetEnrollmentEventNew/Validated/validated.types';

type Props = {|
    scheduledLabel: string,
    referralDataValues: ReferralDataValueStates,
    onBlurDateField: (value: string) => void,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForReferral,
|}

const DateFieldForForm =
    withDefaultFieldContainer()(
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

export const DateFieldForReferral = ({
    scheduledLabel,
    referralDataValues,
    onBlurDateField,
    saveAttempted,
    errorMessages,
}: Props) => (
    <DateFieldForForm
        label={scheduledLabel}
        value={referralDataValues.scheduledAt ? convertStringToDateFormat(referralDataValues.scheduledAt) : ''}
        required
        onSetFocus={() => {}}
        onFocus={() => {}}
        onRemoveFocus={() => {}}
        styles={baseInputStyles}
        calendarWidth={350}
        onBlur={onBlurDateField}
        errorMessage={saveAttempted && errorMessages?.scheduledAt}
    />
);
