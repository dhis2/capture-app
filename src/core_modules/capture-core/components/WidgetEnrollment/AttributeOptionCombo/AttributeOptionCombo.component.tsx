import React from 'react';
import { IconLegend16, colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { AttributeOptionComboDetails } from '../hooks/useAttributeOptionComboDetails';

const styles = {
    row: {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacersNum.dp8}px 0`,
        fontSize: '14px',
        color: colors.grey900,
        gap: `${spacersNum.dp4}px`,
    },
};

type Props = {
    attributeOptionComboDetails?: AttributeOptionComboDetails;
};

const AttributeOptionComboPlain = ({
    classes,
    attributeOptionComboDetails,
}: Props & WithStyles<typeof styles>) => {
    if (!attributeOptionComboDetails || attributeOptionComboDetails.categoryCombo?.isDefault) {
        return null;
    }

    return (
        <>
            {attributeOptionComboDetails.categoryOptions.map(option => (
                <div
                    key={option.id}
                    className={classes.row}
                    data-test="widget-enrollment-attribute-option-combo"
                >
                    <span data-test="widget-enrollment-icon-attribute-option-combo">
                        <IconLegend16 color={colors.grey600} />
                    </span>
                    {i18n.t('{{categoryName}}{{escape}}', {
                        categoryName: option.categories?.[0]?.displayName,
                        escape: ':',
                    })}
                    {option.displayName}
                </div>
            ))}
        </>
    );
};

export const AttributeOptionCombo = withStyles(styles)(AttributeOptionComboPlain);
