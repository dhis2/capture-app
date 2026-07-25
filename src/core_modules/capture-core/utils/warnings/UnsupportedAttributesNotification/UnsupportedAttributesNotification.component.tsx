import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacers } from '@dhis2/ui';
import type { SearchAttribute } from '../../../metaDataMemoryStoreBuilders/common/factory/searchGroup';
import { useProgramLabel } from '../../../metaData';

const styles: Readonly<any> = (theme: any) => ({
    container: {
        marginTop: spacers.dp16,
        marginBottom: spacers.dp16,
    },
    attributeName: {
        fontWeight: theme.typography.fontWeightMedium,
    },
});

type Props = {
    unsupportedAttributes: SearchAttribute[];
} & WithStyles<typeof styles>;

const UnsupportedAttributesNotificationPlain = ({
    unsupportedAttributes,
    classes,
}: Props) => {
    const attribute = useProgramLabel('attribute') ?? i18n.t('attribute');
    const attributes = useProgramLabel('attribute', { plural: true }) ?? i18n.t('attributes');
    const isSingular = unsupportedAttributes.length === 1;
    const message = i18n.t('The following {{attribute}} type is not supported for searching and has been hidden', {
        count: unsupportedAttributes.length,
        attribute: isSingular ? attribute : attributes,
        defaultValue:
            'The following {{attribute}} type is not supported for searching and has been hidden',
        defaultValue_plural:
            'The following {{attribute}} types are not supported for searching and have been hidden',
        interpolation: { escapeValue: false },
    });

    return (
        <div className={classes.container}>
            <NoticeBox
                title={i18n.t('Some {{attributes}} are hidden', {
                    attributes,
                    interpolation: { escapeValue: false },
                })}
                warning
            >
                {message}{': '}
                {unsupportedAttributes.map((attr, index) => (
                    <span key={attr.trackedEntityAttribute.id} className={classes.attributeName}>
                        {attr.trackedEntityAttribute.displayFormName}
                        {index < unsupportedAttributes.length - 1 && ', '}
                    </span>
                ))}.
            </NoticeBox>
        </div>
    );
};

export const UnsupportedAttributesNotification = withStyles(styles)(UnsupportedAttributesNotificationPlain);
