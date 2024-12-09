// @flow
import React, { useState } from 'react';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import {
    DateField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

type Props = {|
    scheduledLabel: string,
    relatedStagesDataValues: RelatedStageDataValueStates,
    onBlurDateField: (value: string) => void,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForRelatedStages,
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

export const DateFieldForRelatedStages = ({
    scheduledLabel,
    relatedStagesDataValues,
    onBlurDateField,
    saveAttempted,
    errorMessages,
}: Props) => {
    const [touched, setTouched] = useState(false);

    const onBlur = (event) => {
        setTouched(true);
        onBlurDateField(event);
    };

    const shouldShowError = (touched || saveAttempted);
    return (
        <DateFieldForForm
            label={scheduledLabel}
            value={relatedStagesDataValues.scheduledAt ? convertStringToDateFormat(relatedStagesDataValues.scheduledAt) : ''}
            required
            onSetFocus={() => {}}
            onFocus={() => {}}
            onRemoveFocus={() => {}}
            styles={baseInputStyles}
            calendarWidth={350}
            onBlur={onBlur}
            errorMessage={shouldShowError && errorMessages?.scheduledAt}
        />
    );
};
