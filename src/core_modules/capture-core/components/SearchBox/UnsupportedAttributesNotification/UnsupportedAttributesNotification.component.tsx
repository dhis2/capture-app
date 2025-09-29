import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacers } from '@dhis2/ui';

const styles: Readonly<any> = (theme: any) => ({
    container: {
        marginBottom: spacers.dp16,
    },
    attributeName: {
        fontWeight: theme.typography.fontWeightMedium,
    },
});

type FilteredAttribute = {
    id: string;
    displayName: string;
    valueType: string;
};

type Props = {
    filteredUnsupportedAttributes: FilteredAttribute[];
} & WithStyles<typeof styles>;

const UnsupportedAttributesNotificationPlain = ({
    filteredUnsupportedAttributes,
    classes,
}: Props) => {
    if (!filteredUnsupportedAttributes || filteredUnsupportedAttributes.length === 0) {
        return null;
    }

    const message =
        i18n.t('The following attribute type is not supported for searching and has been hidden', {
            count: filteredUnsupportedAttributes.length,
            defaultValue:
                'The following attribute type is not supported for searching and has been hidden',
            defaultValue_plural:
                'The following attribute types are not supported for searching and have been hidden',
        });

    return (
        <div className={classes.container}>
            <NoticeBox title={i18n.t('Some attributes are hidden')} warning>
                {message}{': '}
                {filteredUnsupportedAttributes.map((attr, index) => (
                    <span key={attr.id} className={classes.attributeName}>
                        {attr.displayName}
                        {index < filteredUnsupportedAttributes.length - 1 && ', '}
                    </span>
                ))}.
            </NoticeBox>
        </div>
    );
};

export const UnsupportedAttributesNotification = withStyles(styles)(UnsupportedAttributesNotificationPlain);
