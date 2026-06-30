import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    SingleSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from '../FormComponents/dataEntryFieldLabels.module.css';
import { baseInputStyles } from '../FormComponents/commonProps';
import { useStageLabel } from '../../../metaData';
import type { LinkToExistingProps } from './LinkToExisting.types';

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
    const event = useStageLabel('event') ?? i18n.t('event');

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

    const options = linkableEvents.map(linkableEvent => ({
        value: linkableEvent.id,
        label: linkableEvent.label,
    }));

    const label = i18n.t('Choose a {{linkableStageLabel}} {{event}}', {
        linkableStageLabel,
        event,
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
            placeholder={i18n.t('Select {{event}}', { event })}
            clearable
            styles={baseInputStyles}
            errorMessage={shouldShowError ? errorMessages.linkedEventId : undefined}
            dataTest="related-stages-existing-response-list"
        />
    );
};
