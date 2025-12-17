import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NewSingleSelectField } from '../../FormFields/New';
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
    errorMessages;
    saveAttempted;

    const onChange = (value: string | null) => {
        setRelatedStagesDataValues({
            ...relatedStagesDataValues,
            linkedEventId: value || '',
        });
    };

    const options = linkableEvents.map(event => ({
        value: event.id,
        label: event.label,
    }));

    return (
        <div className={classes.searchRow}>
            <p className={classes.label}>
                {i18n.t('Choose a {{linkableStageLabel}} event', {
                    linkableStageLabel,
                })}
            </p>
            <div className={classes.singleSelectField}>
                <NewSingleSelectField
                    value={relatedStagesDataValues.linkedEventId}
                    onChange={onChange}
                    placeholder={i18n.t('Choose a {{linkableStageLabel}}', {
                        linkableStageLabel,
                    })}
                    dataTest="related-stages-existing-response-list"
                    options={options}
                />
            </div>
        </div>
    );
};

export const LinkToExisting = withStyles(styles)(LinkToExistingPlain) as ComponentType<LinkToExistingProps>;
