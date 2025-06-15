import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField, SingleSelectOption, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import type { LinkToExistingProps } from './LinkToExisting.types';

const styles: Readonly<any> = {
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
};

type Props = LinkToExistingProps & WithStyles<typeof styles>;

export const LinkToExistingPlain = ({
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    linkableEvents,
    linkableStageLabel,
    errorMessages,
    saveAttempted,
    classes,
}: Props) => {
    const onChange = (value: string) => {
        setRelatedStagesDataValues({
            ...relatedStagesDataValues,
            linkedEventId: value,
        });
    };

    return (
        <div className={classes.searchRow}>
            <p className={classes.label}>
                {String(i18n.t('Choose a {{linkableStageLabel}} event', {
                    linkableStageLabel,
                }))}
            </p>
            <SingleSelectField
                selected={relatedStagesDataValues.linkedEventId}
                onChange={({ selected }) => onChange(selected)}
                placeholder={i18n.t('Choose a {{linkableStageLabel}}', {
                    linkableStageLabel,
                })}
                className={classes.singleSelectField}
                error={saveAttempted && !!errorMessages.linkedEventId}
                validationText={saveAttempted ? errorMessages.linkedEventId : undefined}
                dataTest="related-stages-existing-response-list"
            >
                {linkableEvents
                    .map(event => (
                        <SingleSelectOption
                            key={event.id}
                            value={event.id}
                            label={event.label}
                        />
                    ))
                }
            </SingleSelectField>
        </div>
    );
};

export const LinkToExisting = withStyles(styles)(LinkToExistingPlain) as ComponentType<LinkToExistingProps>;
