import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NoticeBox, spacers } from '@dhis2/ui';
import { useTermLabel } from '../../../metaData';
import { customTerms } from '../../customTerms';
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
    const attributeLabel = useTermLabel('attribute');
    const attributesLabel = useTermLabel('attribute', { plural: true });
    const message =
        customTerms.i18n.t('The following {{attributeLabel}} type is not supported for searching and has been hidden', {
            count: unsupportedAttributes.length,
            attributeLabel,
            defaultValue:
                'The following {{attributeLabel}} type is not supported for searching and has been hidden',
            defaultValue_plural:
                'The following {{attributeLabel}} types are not supported for searching and have been hidden',
        });

    return (
        <div className={classes.container}>
            <NoticeBox title={customTerms.i18n.t('Some {{attributesLabel}} are hidden', { attributesLabel })} warning>
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
