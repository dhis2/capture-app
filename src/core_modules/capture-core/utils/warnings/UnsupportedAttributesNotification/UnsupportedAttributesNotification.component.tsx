import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacers } from '@dhis2/ui';
import type { SearchAttribute } from '../../../metaDataMemoryStoreBuilders/common/factory/searchGroup';

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
    const message =
        i18n.t('The following attribute type is not supported for searching and has been hidden', {
            count: unsupportedAttributes.length,
            defaultValue:
                'The following attribute type is not supported for searching and has been hidden',
            defaultValue_plural:
                'The following attribute types are not supported for searching and have been hidden',
        });

    return (
        <div className={classes.container}>
            <NoticeBox title={i18n.t('Some attributes are hidden')} warning>
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
