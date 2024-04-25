// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    SingleSelectField,
    SingleSelectOption,
    spacers,
} from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { LinkToExistingProps } from './LinkToExisting.types';

const styles = () => ({
    searchRow: {
        padding: spacers.dp16,
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp16,
    },
    label: {
        width: '150px',
        fontSize: '14px',
    },
    singleSelectField: {
        flexGrow: 1,
    },
});

export const LinkToExistingPlain = ({
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    linkableEvents,
    linkableStageLabel,
    errorMessages,
    saveAttempted,
    classes,
}: LinkToExistingProps) => {
    const onChange = (value) => {
        setRelatedStagesDataValues({
            ...relatedStagesDataValues,
            linkedEventId: value,
        });
    };

    return (
        <div className={classes.searchRow}>
            <p className={classes.label}>
                {i18n.t('Link to an existing {{linkableStageLabel}}', {
                    linkableStageLabel,
                })}
            </p>
            <SingleSelectField
                selected={relatedStagesDataValues.linkedEventId}
                onChange={({ selected }) => onChange(selected)}
                placeholder={i18n.t('Choose a {{linkableStageLabel}}', {
                    linkableStageLabel,
                })}
                className={classes.singleSelectField}
                error={saveAttempted && !!errorMessages.linkedEventId}
                validationText={saveAttempted && errorMessages.linkedEventId}
            >
                {linkableEvents.map(event => (
                    <SingleSelectOption
                        key={event.id}
                        value={event.id}
                        label={event.label}
                    />
                ))}
            </SingleSelectField>
        </div>
    );
};

export const LinkToExisting =
    withStyles(styles)(LinkToExistingPlain);
