import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
// @ts-expect-error - SimpleSingleSelectField exists but types may not be available
import { SimpleSingleSelectField } from '@dhis2-ui/select';
import type { LinkToExistingProps } from './LinkToExisting.types';

const styles: Readonly<any> = ({ typography }: any) => ({
    selectField: {
        maxWidth: typography.pxToRem(300),
        padding: spacers.dp16,
    },
});

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
            linkedEventId: value ?? '',
        });
    };

    const handleClear = () => {
        setRelatedStagesDataValues({
            ...relatedStagesDataValues,
            linkedEventId: '',
        });
    };

    const options = linkableEvents.map(event => ({
        value: event.id,
        label: event.label,
    }));

    const label = i18n.t('Choose a {{linkableStageLabel}} event', {
        linkableStageLabel,
    });


    return (
        <div className={classes.selectField}>

            <SimpleSingleSelectField
                name="related-stages-existing-response-list"
                selected={relatedStagesDataValues.linkedEventId}
                onChange={onChange}
                onClear={handleClear}
                placeholder={i18n.t('Select an event')}
                label={label}
                options={options}
                clearable
                dataTest="related-stages-existing-response-list"
            />
        </div>
    );
};

export const LinkToExisting = withStyles(styles)(LinkToExistingPlain) as ComponentType<LinkToExistingProps>;
