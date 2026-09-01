import React, { useState } from 'react';
import {
    SingleSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from '../FormComponents/dataEntryFieldLabels.module.css';
import { baseInputStyles } from '../FormComponents/commonProps';
import type { LinkToExistingProps } from './LinkToExisting.types';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

const SingleSelectForForm = withDefaultFieldContainer()(
    withLabel({
        onGetCustomFieldLabeClass: () => labelTypeClasses.dateLabel,
    })(
        withDisplayMessages()(
            SingleSelectField,
        ),
    ),
);

export const LinkToExisting = ({
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    linkableEvents,
    linkableStageLabel,
    errorMessages,
    saveAttempted,
}: LinkToExistingProps) => {
    const [touched, setTouched] = useState(false);
    const eventLabel = useTermLabel('event');

    const handleChange = (value: string | null) => {
        setTouched(true);
        setRelatedStagesDataValues({
            ...relatedStagesDataValues,
            linkedEventId: value || undefined,
        });
    };

    const handleBlur = () => {
        setTouched(true);
    };

    const options = linkableEvents.map(event => ({
        value: event.id,
        label: event.label,
    }));

    const label = tCustomTerm('Choose a {{linkableStageLabel}} {{eventLabel}}', {
        linkableStageLabel,
        eventLabel,
    });

    const shouldShowError = (saveAttempted || touched);

    return (
        <SingleSelectForForm
            label={label}
            value={relatedStagesDataValues.linkedEventId || null}
            required
            onChange={handleChange}
            onBlur={handleBlur}
            options={options}
            placeholder={tCustomTerm('Select an {{eventLabel}}', { eventLabel })}
            clearable
            styles={baseInputStyles}
            errorMessage={shouldShowError ? errorMessages.linkedEventId : undefined}
            dataTest="related-stages-existing-response-list"
        />
    );
};
