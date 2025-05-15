import React, { useState } from 'react';
import {
    DateField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

type Props = {
    scheduledLabel: string;
    relatedStagesDataValues: RelatedStageDataValueStates;
    onBlurDateField: (value: string, internalComponentError?: {error: string | null, errorCode: string | null}) => void;
    saveAttempted: boolean;
    errorMessages: ErrorMessagesForRelatedStages;
}

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

    const onBlur = (event, internalComponentError) => {
        setTouched(true);
        onBlurDateField(event, internalComponentError);
    };
    const calendarType = systemSettingsStore.get().calendar;
    const dateFormat = systemSettingsStore.get().dateFormat;
    const shouldShowError = (touched || saveAttempted);
    return (
        <DateFieldForForm
            label={scheduledLabel}
            value={relatedStagesDataValues.scheduledAt ? relatedStagesDataValues.scheduledAt : ''}
            required
            onSetFocus={() => {}}
            onFocus={() => {}}
            onRemoveFocus={() => {}}
            styles={baseInputStyles}
            calendarWidth={350}
            onBlur={onBlur}
            errorMessage={shouldShowError && errorMessages?.scheduledAt}
            calendarType={calendarType}
            dateFormat={dateFormat}
        />
    );
};
