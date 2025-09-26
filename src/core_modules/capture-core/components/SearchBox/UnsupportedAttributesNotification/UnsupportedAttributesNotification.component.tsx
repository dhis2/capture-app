import React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacers } from '@dhis2/ui';

const styles = {
    container: {
        marginBottom: spacers.dp16,
    },
};

type FilteredAttribute = {
    id: string;
    displayName: string;
    valueType: string;
};

type Props = {
    filteredUnsupportedAttributes: FilteredAttribute[];
    classes: {
        container: string;
    };
};

const UnsupportedAttributesNotificationPlain = ({
    filteredUnsupportedAttributes,
    classes,
}: Props) => {
    if (!filteredUnsupportedAttributes || filteredUnsupportedAttributes.length === 0) {
        return null;
    }

    const attributeNames = filteredUnsupportedAttributes
        .map(attr => attr.displayName)
        .join(', ');

    const message = filteredUnsupportedAttributes.length === 1
        ? i18n.t('The following attribute type is not supported for searching and has been hidden: {{attributes}}', {
            attributes: attributeNames,
            interpolation: { escapeValue: false },
        })
        : i18n.t('The following attribute types are not supported for searching and have been hidden: {{attributes}}', {
            attributes: attributeNames,
            interpolation: { escapeValue: false },
        });

    return (
        <div className={classes.container}>
            <NoticeBox title={i18n.t('Some attributes hidden')} warning>
                {message}
            </NoticeBox>
        </div>
    );
};

export const UnsupportedAttributesNotification = withStyles(styles)(UnsupportedAttributesNotificationPlain);
